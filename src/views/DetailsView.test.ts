import { describe, it, vi } from 'vitest'
import { render } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import { DetailsView } from './'

import { type Meal, mealsApi } from '../store/api'
import { writable } from 'svelte/store'

// @ts-expect-error: return type does not match
mealsApi.endpoints.getMealById.initiate = (id: string) => () => ({ arg: id })
const meal: Meal[] = [{ idMeal: '1', strMeal: 'Meal 1', strCategory: 'Cat1', strMealThumb: 'img1.jpg', strYoutube: '' }]

const id = writable('1')
const favorites = writable(['1', '2'])
const meals = writable({ error:false, isLoading: false, data: { meals:meal as Meal[] | null } })

const mockDispatch = vi.fn()
vi.mock('../store', () => ({
  useSelector: (fn: (state: unknown) => unknown) => {
    if (fn.toString().includes('id')) return id
    if (fn.toString().includes('favorites')) return favorites
    if (fn.toString().includes('getMealById')) return meals
    if (fn.toString().includes('checklist')) return writable({ 1: { instructions: [], ingredients: [] } })
    return writable(null)
  },
  useDispatch: () => mockDispatch,
}))

describe('DetailsView', () => {
  beforeEach(() => {
    id.set('1')
    favorites.set(['1', '2'])
    meals.set({ error: false, isLoading: false, data: { meals: meal } })
    mockDispatch.mockClear()
  })

  it('renders the details view', () => {
    const { getByText } = render(DetailsView)
    expect(getByText('Meal 1')).toBeInTheDocument()
  })

  it('shows prompt when no recipe is selected', () => {
    id.set('')
    const { getByText } = render(DetailsView)
    expect(getByText(/please select a recipe/i)).toBeInTheDocument()
  })

  it('shows loading state', () => {
    meals.set({ error:false, isLoading: true, data: { meals:meal } })
    const { getByText } = render(DetailsView)
    expect(getByText(/loading recipe/i)).toBeInTheDocument()
  })

  it('shows error state', () => {
    meals.set({ error:true, isLoading: false, data: { meals:meal } })
    const { getByText } = render(DetailsView)
    expect(getByText(/failed to load recipe/i)).toBeInTheDocument()
  })

  it('toggles favorite (removes if already favorite)', async () => {
    const { getByRole } = render(DetailsView)
    const favBtn = getByRole('button', { name: /remove from favorites/i })
    await favBtn.click()
    expect(typeof mockDispatch.mock.calls[0][0]).toBe('function')
  })

  it('toggles favorite (adds if not favorite)', async () => {
    favorites.set(['2'])
    const { getByRole } = render(DetailsView)
    const favBtn = getByRole('button', { name: /add to favorites/i })
    await favBtn.click()
    expect(typeof mockDispatch.mock.calls[0][0]).toBe('function')
  })

  it('checks and unchecks an ingredient', async () => {
    meals.set({ error: false, isLoading: false, data: { meals: [{ ...meal[0], strIngredient1: 'Egg', strMeasure1: '2' }] } })
    const { getAllByRole } = render(DetailsView)
    const checkboxes = getAllByRole('checkbox', { name: '' })
    await checkboxes[0].click()
    expect(typeof mockDispatch.mock.calls[0][0]).toBe('function')
    await checkboxes[0].click()
    expect(typeof mockDispatch.mock.calls[0][0]).toBe('function')
  })

  it('checks and unchecks an instruction', async () => {
    meals.set({ error: false, isLoading: false, data: { meals: [{ ...meal[0], strInstructions: 'Step one. Step two.' }] } })
    const { getAllByRole } = render(DetailsView)
    const checkboxes = getAllByRole('checkbox', { name: '' })
    await checkboxes[0].click()
    expect(typeof mockDispatch.mock.calls[0][0]).toBe('function')
    await checkboxes[0].click()
    expect(typeof mockDispatch.mock.calls[0][0]).toBe('function')
  })

  it('displays the YouTube link if present', () => {
    meals.set({
      error: false,
      isLoading: false,
      data: { meals: [{ ...meal[0], strYoutube: 'https://youtube.com/fakevideo' }] },
    })
    const { getByText } = render(DetailsView)
    // The DetailsView should render a link or text containing the YouTube URL
    expect(getByText(/watch on youtube/i)).toBeInTheDocument()
  })

  it('shows "No recipe found" if meals is falsy', () => {
    meals.set({ error: false, isLoading: false, data: { meals: null } })
    const { getByText } = render(DetailsView)
    expect(getByText(/no recipe found/i)).toBeInTheDocument()
  })

  it('does not display YouTube link if strYoutube is missing', () => {
    meals.set({ error: false, isLoading: false, data: { meals: [{ ...meal[0], strYoutube: '' }] } })
    const { queryByText } = render(DetailsView)
    expect(queryByText(/watch on youtube/i)).not.toBeInTheDocument()
  })

  it('renders a non-empty ingredient measure', () => {
    meals.set({
      error: false,
      isLoading: false,
      data: { meals: [{ ...meal[0], strIngredient1: 'Egg', strMeasure1: '2 tbsp' }] },
    })
    const { getByText } = render(DetailsView)
    expect(getByText(/2 tbsp/i)).toBeInTheDocument()
  })

  it('does not render an empty ingredient measure', () => {
    meals.set({
      error: false,
      isLoading: false,
      data: { meals: [{ ...meal[0], strIngredient1: 'Egg', strMeasure1: '   ' }] },
    })
    const { queryByText } = render(DetailsView)
    expect(queryByText(/Egg/)).toBeInTheDocument()
    expect(queryByText(/-/)).not.toBeInTheDocument() // or check for the measure text specifically
  })

  it('renders without crashing if strCategory is missing', () => {
    meals.set({
      error: false,
      isLoading: false,
      data: { meals: [{ ...meal[0], strCategory: undefined }] },
    })
    const { getByText } = render(DetailsView)
    expect(getByText('Meal 1')).toBeInTheDocument()
  })
})
