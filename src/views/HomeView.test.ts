// mocks must be initiated before the other modules
import { meal, id, name, favorites, meals, mockDispatch, setupStoreMocks, dispatchedActions } from '../store/mocks'
setupStoreMocks()

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import { HomeView } from '../views'
import '@testing-library/jest-dom/vitest'

describe('HomeView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    id.set('1')
    favorites.set(['1', '2'])
    meals.set({ error: false, isLoading: false, data: { meals: meal } })
    name.set('beef')
    mockDispatch.mockClear()
  })

  it('should render the logo and recent activity section', () => {
    const { getByAltText, getByText } = render(HomeView)

    expect(getByAltText('ClassifiCam Logo')).toBeInTheDocument()
    expect(getByText('Recent Activity')).toBeInTheDocument()
    expect(getByText('See more')).toBeInTheDocument()
  })

  it('should render the search by name input and button', () => {
    const { getByLabelText, getByPlaceholderText } = render(HomeView)
    // Use the label from the SearchBox
    expect(getByLabelText('Search Recipe by Name')).toBeInTheDocument()
    expect(getByPlaceholderText('e.g., Arrabiata')).toBeInTheDocument()
  })

  it('should render the search by ingredient input and button', () => {
    const { getByLabelText, getByPlaceholderText } = render(HomeView)
    // Use the label from the SearchBox
    expect(getByLabelText('Search Recipes by Ingredient')).toBeInTheDocument()
    expect(getByPlaceholderText('e.g., beef')).toBeInTheDocument()
  })

  it('dispatches correct action when searching by name', async () => {
    id.set('52768')  // must use a real recipe id
    const { getAllByRole } = render(HomeView)
    const searchButtons = getAllByRole('button', { name: /search/i })
    mockDispatch.mockClear()
    await searchButtons[0].click()
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'app/viewDetails',
      payload: { id: '52768' },
    })
  })

  it('dispatches correct action when searching by ingredient', async () => {
    const { getAllByRole } = render(HomeView)
    const searchButtons = getAllByRole('button', { name: /search/i })
    mockDispatch.mockClear()
    await searchButtons[1].click()
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'app/viewMatches',
      payload: { name: 'beef' },
    })
  })

  it('dispatches app/viewDetails with correct id when openRecipe is called', async () => {
    const { findByText, getByText } = render(HomeView)
    await findByText('Meal 2')
    const recipe = getByText('Meal 2')
    await recipe.click()
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'app/viewDetails',
      payload: { id: '52772' },
    })
  })

  it('dispatches deleteRecentRecipe when the delete button is clicked in recents', async () => {
    const { findByText, findByTitle } = render(HomeView)
    await findByText('Meal 2')
    const deleteBtn = await findByTitle('Remove')
    mockDispatch.mockClear()
    await fireEvent.click(deleteBtn)
    expect(dispatchedActions).toContainEqual(expect.objectContaining({ type: 'app/_deleteRecent' }))
  })

  it('dispatches app/viewRecents when the Recent Activity button is clicked', async () => {
    const { getByText } = render(HomeView)
    const seeMoreBtn = getByText('See more')
    mockDispatch.mockClear()
    await fireEvent.click(seeMoreBtn)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'app/viewRecents',
    })
  })
})
