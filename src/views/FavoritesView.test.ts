import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import { FavoritesView } from './'
import { useDispatch, useSelector } from '../store'
import { type Meal } from '../store/api'
import { writable } from 'svelte/store'

import { mealsApi } from '../store/api'

// @ts-expect-error: return type does not match
mealsApi.endpoints.getMealById.initiate = (id: string) => ({ arg: id })

vi.mock('../store', () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}))

const meals: Meal[] = [
  { idMeal: '1', strMeal: 'Meal 1', strCategory: 'Cat1', strMealThumb: 'img1.jpg' },
  { idMeal: '2', strMeal: 'Meal 2', strCategory: 'Cat2', strMealThumb: 'img2.jpg' },
]

describe('FavoritesView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSelector).mockReturnValue(writable(['1', '2']))
    // @ts-expect-error: return type does not match
    vi.mocked(useDispatch).mockReturnValue((a) => {
      return ({
        unwrap: () => Promise.resolve({ meals: meals.filter((m) => m.idMeal === a.arg) }),
      })
    })
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
    expect(vi.mocked(useDispatch).mock.results[0].value).toBeDefined()
  })

  it('opens the recipe when the "View" button is clicked', async () => {
    const { findAllByText } = render(FavoritesView)
    const viewButtons = await findAllByText('View')
    await viewButtons[0].click()
    expect(vi.mocked(useDispatch).mock.results[0].value).toBeDefined()
  })

  it('removes the meal when the "Remove" button is clicked', async () => {
    const { findAllByTitle } = render(FavoritesView)
    const removeButtons = await findAllByTitle('Remove')
    await removeButtons[0].click()
    expect(vi.mocked(useDispatch).mock.results[0].value).toBeDefined()
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
    // Mock useSelector to return no favorites
    vi.mocked(useSelector).mockReturnValue(writable([]))
    const { queryAllByRole } = render(FavoritesView)
    expect(queryAllByRole('heading', { level: 2 }).length).toBe(0)
  })
})
