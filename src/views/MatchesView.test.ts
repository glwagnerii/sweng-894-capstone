import { describe, it, vi } from 'vitest'
import { render } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import { MatchesView } from './'

import { type Meal, mealsApi } from '../store/api'
import { writable } from 'svelte/store'

// @ts-expect-error: return type does not match
mealsApi.endpoints.getMealsByIngredient.initiate = (ingredient: string) => () => ({ arg: ingredient })
const meal: Meal[] = [
  { idMeal: '1', strMeal: 'Meal 1', strCategory: 'Cat1', strMealThumb: 'img1.jpg', strYoutube: '' },
]

const name = writable('ham')
const meals = writable({ error:false, isLoading: false, data: { meals:meal as Meal[] | null } })

const mockDispatch = vi.fn()
vi.mock('../store', () => ({
  useSelector: (fn: (state: unknown) => unknown) => {
    if (fn.toString().includes('name')) return name
    if (fn.toString().includes('getMealsByIngredient')) return meals
    return writable(null)
  },
  useDispatch: () => mockDispatch,
}))

describe('DetailsView', () => {
  beforeEach(() => {
    name.set('ham')
    meals.set({ error: false, isLoading: false, data: { meals: meal } })
    mockDispatch.mockClear()
  })

  it('renders the details view', () => {
    const { getByText } = render(MatchesView)
    expect(getByText('Meal 1')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    meals.set({ error:false, isLoading: true, data: { meals:meal } })
    const { getByText } = render(MatchesView)
    expect(getByText(/Loading meals/i)).toBeInTheDocument()
  })

  it('shows error state', () => {
    meals.set({ error:true, isLoading: false, data: { meals:meal } })
    const { getByText } = render(MatchesView)
    expect(getByText(/Failed to load meals/i)).toBeInTheDocument()
  })

  it('dispatches viewDetails when a recipe is clicked', async () => {
    const { getByText } = render(MatchesView)
    const recipe = getByText('Meal 1')
    await recipe.click()
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'app/viewDetails',
      payload: { id: '1' },
    })
  })
})
