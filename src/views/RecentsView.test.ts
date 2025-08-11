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
    mockDispatch.mockImplementationOnce(() => ({
      unwrap: () => Promise.reject(new Error('fail')),
    }))
    const { findByText } = render(RecentsView)
    expect(await findByText('Failed to load recent meals')).toBeInTheDocument()
  })

  it('dispatches viewDetails when View button is clicked', async () => {
    const { findAllByText } = render(RecentsView)
    const viewBtns = await findAllByText('View')
    await fireEvent.click(viewBtns[0])
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'app/viewDetails',
      payload: { id: '1' },
    })
  })

  it('dispatches deleteRecentRecipe when Remove button is clicked', async () => {
    const { findAllByTitle } = render(RecentsView)
    const removeBtns = await findAllByTitle('Remove')
    mockDispatch.mockClear()
    await fireEvent.click(removeBtns[0])
    // If deleteRecentRecipe is a thunk, check for a function
    expect(dispatchedActions).toContainEqual(expect.objectContaining({ type: 'app/_deleteRecent' }))
  })

  it('warns if a recent meal is missing', async () => {
    // Set a recent with an id not in meals
    recents.set([
      {
        idMeal: '999',
        strMeal: 'Missing Meal',
        strMealThumb: 'missing.jpg',
        viewedAt: new Date().toISOString(),
      },
    ])
    // Mock unwrap to return no meals
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
