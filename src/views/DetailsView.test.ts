// mocks must be initiated before the other modules
import { meal, id, favorites, meals, mockDispatch, setupStoreMocks, dispatchedActions } from '../store/mocks'
setupStoreMocks()

import { describe, it, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import { DetailsView } from './'

describe('DetailsView', () => {
  let alertMock: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    id.set('1')
    favorites.set(['1', '2'])
    meals.set({ error: false, isLoading: false, data: { meals: meal } })
    mockDispatch.mockClear()
    alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  afterEach(() => {
    alertMock.mockRestore()
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
    mockDispatch.mockClear()
    await favBtn.click()
    expect(dispatchedActions).toContainEqual(expect.objectContaining({ type: 'app/_deleteFavorite' }))
  })

  it('toggles favorite (adds if not favorite)', async () => {
    favorites.set(['2'])
    const { getByRole } = render(DetailsView)
    const favBtn = getByRole('button', { name: /add to favorites/i })
    mockDispatch.mockClear()
    await favBtn.click()
    expect(dispatchedActions).toContainEqual(expect.objectContaining({ type: 'app/_addFavorite' }))
  })

  it('checks and unchecks an ingredient', async () => {
    meals.set({ error: false, isLoading: false, data: { meals: [{ ...meal[0], strIngredient1: 'Egg', strMeasure1: '2' }] } })
    const { getAllByRole } = render(DetailsView)
    const checkboxes = getAllByRole('checkbox', { name: '' })
    mockDispatch.mockClear()
    await checkboxes[0].click()
    expect(dispatchedActions).toContainEqual(expect.objectContaining({ type: 'app/_toggleIngredientCheck' }))
    mockDispatch.mockClear()
    await checkboxes[0].click()
    expect(dispatchedActions).toContainEqual(expect.objectContaining({ type: 'app/_toggleIngredientCheck' }))
  })

  it('checks and unchecks an instruction', async () => {
    meals.set({ error: false, isLoading: false, data: { meals: [{ ...meal[0], strInstructions: 'Step one. Step two.' }] } })
    const { getAllByRole } = render(DetailsView)
    const checkboxes = getAllByRole('checkbox', { name: '' })
    mockDispatch.mockClear()
    await checkboxes[0].click()
    expect(dispatchedActions).toContainEqual(expect.objectContaining({ type: 'app/_toggleInstructionCheck' }))
    mockDispatch.mockClear()
    await checkboxes[0].click()
    expect(dispatchedActions).toContainEqual(expect.objectContaining({ type: 'app/_toggleInstructionCheck' }))
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
    meals.set({ error: false, isLoading: false, data: { meals: [{ ...meal[0], strIngredient1: 'Egg', strMeasure1: '2 tbsp' }] } })
    const { getByText } = render(DetailsView)
    expect(getByText(/2 tbsp/i)).toBeInTheDocument()
  })

  it('does not render an empty ingredient measure', () => {
    meals.set({ error: false, isLoading: false, data: { meals: [{ ...meal[0], strIngredient1: 'Egg', strMeasure1: '   ' }] } })
    const { queryByText } = render(DetailsView)
    expect(queryByText(/Egg/)).toBeInTheDocument()
    expect(queryByText(/-/)).not.toBeInTheDocument() // or check for the measure text specifically
  })

  it('renders without crashing if strCategory is missing', () => {
    meals.set({ error: false, isLoading: false, data: { meals: [{ ...meal[0], strCategory: undefined }] } })
    const { getByText } = render(DetailsView)
    expect(getByText('Meal 1')).toBeInTheDocument()
  })

  it('copies recipe to clipboard when Copy Recipe is clicked', async () => {
    // Mock clipboard API
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    // @ts-expect-error, clipboard is secure
    ;(global.navigator as Navigator & { clipboard: { writeText: (data: string) => Promise<void> } }).clipboard = { writeText: writeTextMock }

    meals.set({ error: false, isLoading: false, data: { meals: [{ ...meal[0], strCategory: 'Cat1', strArea: 'Area1', strInstructions: 'Step one.', strIngredient1: 'Egg', strMeasure1: '2', strYoutube: 'https://youtube.com/fakevideo' }] } })

    const { getByRole } = render(DetailsView)
    const copyBtn = getByRole('button', { name: /copy recipe/i })
    await fireEvent.click(copyBtn)

    expect(writeTextMock).toHaveBeenCalled()
    expect(alertMock).toHaveBeenCalledWith('Recipe copied to clipboard!')
  })

  it('shows an error alert if copying recipe to clipboard fails', async () => {
    // Mock clipboard API to throw
    const writeTextMock = vi.fn().mockRejectedValue(new Error('Clipboard error'))
    // @ts-expect-error, clipboard is secure
    global.navigator.clipboard = { writeText: writeTextMock }
    // Mock alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    meals.set({
      error: false,
      isLoading: false,
      data: { meals: [{ ...meal[0], strCategory: 'Cat1', strArea: 'Area1', strInstructions: 'Step one.', strIngredient1: 'Egg', strMeasure1: '2', strYoutube: 'https://youtube.com/fakevideo' }] },
    })

    const { getByRole } = render(DetailsView)
    const copyBtn = getByRole('button', { name: /copy recipe/i })
    await fireEvent.click(copyBtn)

    expect(writeTextMock).toHaveBeenCalled()
    expect(alertMock).toHaveBeenCalledWith('Failed to copy recipe.')

    alertMock.mockRestore()
  })

  // --- Additional copyToClipboard edge case tests ---

  it('does not render Copy Recipe button if there is no meal', () => {
    meals.set({ error: false, isLoading: false, data: { meals: null } })

    const { queryByRole } = render(DetailsView)
    const copyBtn = queryByRole('button', { name: /copy recipe/i })
    expect(copyBtn).toBeNull()
  })

  it('copies to clipboard without YouTube link if strYoutube is missing', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    // @ts-expect-error, clipboard is secure
    global.navigator.clipboard = { writeText: writeTextMock }
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    meals.set({
      error: false,
      isLoading: false,
      data: { meals: [{ ...meal[0], strYoutube: '' }] },
    })

    const { getByRole } = render(DetailsView)
    const copyBtn = getByRole('button', { name: /copy recipe/i })
    await fireEvent.click(copyBtn)

    // Should not contain the actual YouTube URL
    expect(writeTextMock).toHaveBeenCalledWith(expect.not.stringContaining('youtube.com'))
    expect(alertMock).toHaveBeenCalledWith('Recipe copied to clipboard!')

    alertMock.mockRestore()
  })

  it('copies to clipboard with no ingredients if none are present', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    // @ts-expect-error, clipboard is secure
    global.navigator.clipboard = { writeText: writeTextMock }
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    meals.set({
      error: false,
      isLoading: false,
      data: { meals: [{ ...meal[0], strIngredient1: '', strMeasure1: '' }] },
    })

    const { getByRole } = render(DetailsView)
    const copyBtn = getByRole('button', { name: /copy recipe/i })
    await fireEvent.click(copyBtn)

    // Should not contain any actual ingredient content after "Ingredients:"
    expect(writeTextMock).toHaveBeenCalledWith(expect.stringMatching(/Ingredients:\s*\n/))
    expect(alertMock).toHaveBeenCalledWith('Recipe copied to clipboard!')

    alertMock.mockRestore()
  })

  it('copies to clipboard with no instructions if none are present', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    // @ts-expect-error, clipboard is secure
    global.navigator.clipboard = { writeText: writeTextMock }
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    // Remove instructions
    meals.set({
      error: false,
      isLoading: false,
      data: { meals: [{ ...meal[0], strInstructions: '' }] },
    })

    const { getByRole } = render(DetailsView)
    const copyBtn = getByRole('button', { name: /copy recipe/i })
    await fireEvent.click(copyBtn)

    // Should not contain any actual instruction content (no text after "Instructions:")
    expect(writeTextMock).toHaveBeenCalledWith(expect.stringMatching(/Instructions:\s*$/m))
    expect(alertMock).toHaveBeenCalledWith('Recipe copied to clipboard!')

    alertMock.mockRestore()
  })

  vi.spyOn(console, 'error').mockImplementation(() => {})
})
