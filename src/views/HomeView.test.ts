/// <reference types="vitest/globals" />

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import { HomeView } from '../views'
import '@testing-library/jest-dom/vitest'
import { writable } from 'svelte/store'
import { vi } from 'vitest'
import { useDispatch, useSelector } from '../store'

vi.mock('../store', () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}))

describe('HomeView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock the selectors for name and recipe
    vi.mocked(useSelector).mockImplementation((selector) => {
      // Simulate the selectors used in HomeView.svelte
      if (selector.toString().includes('state.app.ingredient.name')) { return writable('beef') }
      if (selector.toString().includes('state.app.recipe.id')) { return writable('52772') }
      return writable(undefined)
    })
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
    const mockDispatch = vi.fn()
    vi.mocked(useDispatch).mockReturnValue(mockDispatch)
    const { getAllByRole } = render(HomeView)
    // Find all "Search" buttons (the first is for name)
    const searchButtons = getAllByRole('button', { name: /search/i })
    await searchButtons[0].click()
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'app/viewDetails',
      payload: { id: '52772' },
    })
  })

  it('dispatches correct action when searching by ingredient', async () => {
    const mockDispatch = vi.fn()
    vi.mocked(useDispatch).mockReturnValue(mockDispatch)
    const { getAllByRole } = render(HomeView)
    const searchButtons = getAllByRole('button', { name: /search/i })
    await searchButtons[1].click()
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'app/viewMatches',
      payload: { name: 'beef' },
    })
  })

  // it('calls the handler when "See more" button is clicked', async () => {
  //   // Spy on console.log
  //   const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  //   const { getByText } = render(HomeView)
  //   const seeMoreButton = getByText('See more')
  //   await seeMoreButton.click()
  //   expect(logSpy).toHaveBeenCalledWith('See more clicked')
  //   logSpy.mockRestore()
  // })
})
