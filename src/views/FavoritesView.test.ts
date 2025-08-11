// mocks must be initiated before the other modules
import { meal, id, favorites, meals, mockDispatch, setupStoreMocks, dispatchedActions } from '../store/mocks'
setupStoreMocks()

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import { FavoritesView } from './'

describe('FavoritesView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    id.set('1')
    favorites.set(['1', '2'])
    meals.set({ error: false, isLoading: false, data: { meals: meal } })
    mockDispatch.mockClear()
  })

  it('renders favorite meals after loading', async () => {
    const { findAllByRole } = render(FavoritesView)
    const headings = await findAllByRole('heading', { level: 2 })
    const headingTexts = headings.map((h) => h.textContent)
    expect(headingTexts).toContain('Meal 1')
    expect(headingTexts).toContain('Meal 2')
  })

  it('opens the recipe when the meal image is clicked', async () => {
    const { findAllByRole } = render(FavoritesView)
    const cards = await findAllByRole('button', { name: /Meal 1/i })
    await cards[0].click()
    expect(mockDispatch.mock.results[0].value).toBeDefined()
  })

  it('removes the meal when the "Remove" button is clicked', async () => {
    const { findAllByTitle } = render(FavoritesView)
    const removeButtons = await findAllByTitle('Remove')
    mockDispatch.mockClear()
    await removeButtons[0].click()
    expect(dispatchedActions).toContainEqual(expect.objectContaining({ type: 'app/_deleteFavorite' }))
  })

  it('filters meals by category when a category is selected from the dropdown', async () => {
    const { findByText, getByText, queryByText } = render(FavoritesView)
    // Wait for meals to load
    await findByText('Meal 1')
    // Open the dropdown
    const dropdownButton = getByText('Filter by Category')
    await dropdownButton.click()
    // Click the category button for 'Cat1'
    const cat1Button = getByText('Cat1')
    await cat1Button.click()
    // Now only Meal 1 should be visible
    expect(getByText('Meal 1')).toBeInTheDocument()
    expect(queryByText('Meal 2')).not.toBeInTheDocument()
  })

  it('shows all meals when "All" is selected from the dropdown', async () => {
    const { findByText, getByText } = render(FavoritesView)
    // Wait for meals to load
    await findByText('Meal 1')
    // Open the dropdown and select a category first
    const dropdownButton = getByText('Filter by Category')
    await dropdownButton.click()
    const cat1Button = getByText('Cat1')
    await cat1Button.click()
    // Now open dropdown again and select "All"
    await dropdownButton.click()
    const allButton = getByText('All')
    await allButton.click()
    // Both meals should be visible again
    expect(getByText('Meal 1')).toBeInTheDocument()
    expect(getByText('Meal 2')).toBeInTheDocument()
  })

  it('shows empty state when there are no favorite recipes', async () => {
    favorites.set([])
    const { queryAllByRole } = render(FavoritesView)
    expect(queryAllByRole('heading', { level: 2 }).length).toBe(0)
  })
})
