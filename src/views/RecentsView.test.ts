// mocks must be initiated before the other modules
import { meal, recents, meals, mockDispatch, setupStoreMocks, dispatchedActions } from '../store/mocks'
setupStoreMocks()

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, fireEvent, waitFor } from '@testing-library/svelte'
import { RecentsView } from './'
import '@testing-library/jest-dom/vitest'

describe('RecentsView', () => {
  beforeEach(() => {
    recents.set([
      {
        idMeal: '1',
        strMeal: 'Meal 1',
        strMealThumb: 'img1.jpg',
        viewedAt: new Date().toISOString(),
      },
      {
        idMeal: '2',
        strMeal: 'Meal 2',
        strMealThumb: 'img2.jpg',
        viewedAt: new Date(Date.now() - 100000).toISOString(),
      },
    ])
    meals.set({ error: false, isLoading: false, data: { meals: meal } })
    mockDispatch.mockClear()
  })

  it('shows loading initially', () => {
    const { getByText } = render(RecentsView)
    expect(getByText('Loading...')).toBeInTheDocument()
  })

  it('renders recent meals after loading', async () => {
    const { findByText } = render(RecentsView)
    expect(await findByText('Meal 1')).toBeInTheDocument()
    expect(await findByText('Meal 2')).toBeInTheDocument()
  })

  it('shows empty state if no recents', async () => {
    recents.set([])
    const { findByText } = render(RecentsView)
    expect(await findByText('No Recipes Have Been Viewed Recently.')).toBeInTheDocument()
  })

  it('shows error if fetch fails', async () => {
    // Simulate fetchRecents throwing
    mockDispatch.mockImplementationOnce(() => ({ unwrap: () => Promise.reject(new Error('fail')) }))
    const { findByText } = render(RecentsView)
    expect(await findByText('Failed to load recent meals')).toBeInTheDocument()
  })

  it('dispatches viewDetails when View button is clicked', async () => {
    const { findAllByText } = render(RecentsView)
    const viewBtns = await findAllByText('View')
    await fireEvent.click(viewBtns[0])
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'app/viewDetails', payload: { id: '1' } })
  })

  it('dispatches deleteRecentRecipe when Remove button is clicked', async () => {
    const { findAllByTitle } = render(RecentsView)
    const removeBtns = await findAllByTitle('Remove')
    mockDispatch.mockClear()
    await fireEvent.click(removeBtns[0])
    expect(dispatchedActions).toContainEqual(expect.objectContaining({ type: 'app/_deleteRecent' }))
  })

  it('toggles sortBy when the sort by button is clicked', async () => {
    const { getByTitle, getByText } = render(RecentsView)
    const sortByBtn = getByTitle('Toggle sort by name or date')
    // Initial: should show "Date"
    expect(sortByBtn.textContent).toBe('Date')
    await fireEvent.click(sortByBtn)
    // After click: should show "Name"
    expect(getByText('Name')).toBeInTheDocument()
    await fireEvent.click(sortByBtn)
    // After second click: should show "Date" again
    expect(getByText('Date')).toBeInTheDocument()
  })

  it('toggles sortAsc when the sort asc/desc button is clicked', async () => {
    const { getByTitle, getByText } = render(RecentsView)
    const sortAscBtn = getByTitle('Toggle ascending/descending')
    // Initial: should show "↓"
    expect(sortAscBtn.textContent).toBe('↓')
    await fireEvent.click(sortAscBtn)
    // After click: should show "↑"
    expect(getByText('↑')).toBeInTheDocument()
    await fireEvent.click(sortAscBtn)
    // After second click: should show "↓" again
    expect(getByText('↓')).toBeInTheDocument()
  })

  it('copies recents to clipboard when the Copy button is clicked', async () => {
    // Mock clipboard API
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    // @ts-expect-error, clipboard is secure
    ;(global.navigator as Navigator & { clipboard: { writeText: (data: string) => Promise<void> } }).clipboard = { writeText: writeTextMock }

    const { getByTitle } = render(RecentsView)
    const copyBtn = getByTitle('Copy recent history to clipboard')
    await fireEvent.click(copyBtn)
    expect(writeTextMock).toHaveBeenCalled()
    expect(alertMock).toHaveBeenCalledWith('Recent meals copied to clipboard!')
    alertMock.mockRestore()
  })

  it('shows alert if copying to clipboard fails', async () => {
    // Mock clipboard API to reject
    const writeTextMock = vi.fn().mockRejectedValue(new Error('fail'))
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    // @ts-expect-error, clipboard is secure
    ;(global.navigator as Navigator & { clipboard: { writeText: (data: string) => Promise<void> } }).clipboard = { writeText: writeTextMock }

    const { getByTitle } = render(RecentsView)
    const copyBtn = getByTitle('Copy recent history to clipboard')
    await fireEvent.click(copyBtn)
    expect(writeTextMock).toHaveBeenCalled()
    expect(alertMock).toHaveBeenCalledWith('Failed to copy to clipboard.')
    alertMock.mockRestore()
  })

  it('sorts by date descending when sortAsc is false', async () => {
    const { findAllByText, getByTitle } = render(RecentsView)
    // Default is sortBy 'date', sortAsc false (descending)
    const mealTitles = await findAllByText(/Meal \d/)
    // Meal 1 is newer, so should be first
    expect(mealTitles[0].textContent).toBe('Meal 1')
    expect(mealTitles[1].textContent).toBe('Meal 2')
  })

  it('sorts by date ascending when sortAsc is true', async () => {
    const { findAllByText, getByTitle } = render(RecentsView)
    const sortAscBtn = getByTitle('Toggle ascending/descending')
    await fireEvent.click(sortAscBtn) // Now sortAsc is true (ascending)
    const mealTitles = await findAllByText(/Meal \d/)
    // Meal 2 is older, so should be first
    expect(mealTitles[0].textContent).toBe('Meal 2')
    expect(mealTitles[1].textContent).toBe('Meal 1')
  })

  it('warns if a recent meal is missing', async () => {
    // Set a recent with an id not in meals
    recents.set([ { idMeal: '999', strMeal: 'Missing Meal', strMealThumb: 'missing.jpg', viewedAt: new Date().toISOString() } ])
    mockDispatch.mockImplementation((action) => {
      if (action && typeof action === 'object' && 'arg' in action) {
        return { unwrap: () => Promise.resolve({ meals: [] }) }
      }
      return Promise.resolve()
    })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(RecentsView)
    await waitFor(() => {
      expect(warnSpy).toHaveBeenCalledWith('Mismatch or missing meal for ID: 999')
    })
    warnSpy.mockRestore()
  })
})
