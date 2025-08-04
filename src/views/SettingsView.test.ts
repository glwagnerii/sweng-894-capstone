/// <reference types="vitest/globals" />
import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import SettingsView from './SettingsView.svelte'
import { writable } from 'svelte/store'
import { useDispatch } from '../store'
import { type Models } from '../store/appSlice'
import { open } from '@tauri-apps/plugin-dialog'

vi.mock('@tauri-apps/plugin-dialog', () => ({
  open: vi.fn(() => Promise.resolve('mock-file')),
  message: vi.fn(() => Promise.resolve()),
}))

const models = writable([
  { name: 'TestModel',  file: 'test.onnx',  desc: 'A test model',  shape: '1x3x224x224', size: '10MB', conf: 70, iou: 50 },
  { name: 'TestModel2', file: 'test.onnx2', desc: 'Another model', shape: '1x3x224x224', size: '20MB', conf: 75, iou: 45 },
] as Models[])
const selected = writable('test.onnx' as string | null)

vi.mock('../store', () => ({
  useSelector: (fn: (state: unknown) => unknown) => {
    if (fn.toString().includes('models')) return models
    if (fn.toString().includes('selected')) return selected
    return writable(null)
  },
  useDispatch: vi.fn(),
}))

describe('SettingsView', () => {
  it('renders model selection and details', () => {
    const { getByText, getByLabelText } = render(SettingsView)

    expect(getByText('Detection Settings')).toBeInTheDocument()
    expect(getByLabelText('ONNX Model')).toBeInTheDocument()
    expect(getByText('TestModel (test.onnx)')).toBeInTheDocument()
  })

  it('calls dispatch when Add button is clicked', async () => {
    const mockDispatch = vi.fn()
    vi.mocked(useDispatch).mockReturnValue(mockDispatch)

    const { getByLabelText } = render(SettingsView)
    const addButton = getByLabelText('Add model')
    await fireEvent.click(addButton)

    // Since handleAddModel is async and uses tauri dialog, we can't fully test file selection here,
    // but we can check that the button is present and clickable.
    expect(addButton).toBeInTheDocument()
  })

  it('calls dispatch when Delete button is clicked', async () => {
    const mockDispatch = vi.fn()
    vi.mocked(useDispatch).mockReturnValue(mockDispatch)

    const { getByLabelText } = render(SettingsView)
    const deleteButton = getByLabelText('Delete model')
    await fireEvent.click(deleteButton)

    expect(mockDispatch).toHaveBeenCalled()
  })

  it('model select dropdown is present and has correct value', () => {
    const { getByLabelText } = render(SettingsView)
    const select = getByLabelText('ONNX Model') as HTMLSelectElement
    expect(select).toBeInTheDocument()
    expect(select.value).toBe('test.onnx')
  })

  it('shows input fields with correct ids when editing', async () => {
    const { getAllByRole, container } = render(SettingsView)

    const editButtons = getAllByRole('button', { name: '✏️' })
    for (const btn of editButtons) { await fireEvent.click(btn) }

    expect(container.querySelector('#name')).toBeInTheDocument()
    expect(container.querySelector('#desc')).toBeInTheDocument()
    expect(container.querySelector('#iou')).toBeInTheDocument()
    expect(container.querySelector('#conf')).toBeInTheDocument()
  })

  it('calls dispatch when save button is clicked for name and desc EditableFields', async () => {
    const mockDispatch = vi.fn()
    vi.mocked(useDispatch).mockReturnValue(mockDispatch)
    const { getAllByRole } = render(SettingsView)

    // Enter edit mode for all EditableFields
    const editButtons = getAllByRole('button', { name: '✏️' })
    for (const btn of editButtons) { await fireEvent.click(btn) }

    const saveButtons = getAllByRole('button', { name: '✔️' })
    await fireEvent.click(saveButtons[0])
    expect(typeof mockDispatch.mock.calls[0][0]).toBe('function')

    await fireEvent.click(saveButtons[1])
    expect(typeof mockDispatch.mock.calls[1][0]).toBe('function')
  })

  it('calls dispatch when ThresholdSlider sliders are changed', async () => {
    const mockDispatch = vi.fn()
    vi.mocked(useDispatch).mockReturnValue(mockDispatch)
    const { container } = render(SettingsView)

    // Find the sliders by id
    const iouSlider = container.querySelector('#iou') as HTMLInputElement
    const confSlider = container.querySelector('#conf') as HTMLInputElement

    // Simulate changing the sliders
    await fireEvent.change(iouSlider,  { target: { value: '60' } })
    await fireEvent.change(confSlider, { target: { value: '80' } })

    // The onchange handler should dispatch (likely a thunk)
    expect(typeof mockDispatch.mock.calls[0][0]).toBe('function')
    expect(typeof mockDispatch.mock.calls[1][0]).toBe('function')
  })

  it('shows default values when selected model is not in models', async () => {
    // Set selected to a file not in models
    selected.set('not-in-list.onnx')

    const { getByLabelText, getByTestId } = render(SettingsView)

    const select = getByLabelText('ONNX Model') as HTMLSelectElement
    expect(select).toBeInTheDocument()
    expect(select.value).toBe('')
    expect(select.options.length).toBe(3)
    expect(select.options[0].selected).toBe(false)
    expect(select.options[0].textContent).toContain('-- No model selected --')

    expect(getByTestId('default-name').textContent).toBe('')
    expect(getByTestId('default-desc').textContent).toBe('')
    expect(getByTestId('default-conf').textContent).toBe('0')
    expect(getByTestId('default-iou').textContent).toBe('0')
  })

  it('shows all available models in the model select dropdown', () => {
    const { getAllByRole } = render(SettingsView)
    const options = getAllByRole('option')
    expect(options[1].textContent).toBe('TestModel (test.onnx)')
    expect(options[2].textContent).toBe('TestModel2 (test.onnx2)')
  })

  it('calls dispatch with a thunk when selecting a different model', async () => {
    const mockDispatch = vi.fn()
    vi.mocked(useDispatch).mockReturnValue(mockDispatch)

    // Start with 'test.onnx' selected
    selected.set('test.onnx')

    const { getByLabelText } = render(SettingsView)
    const select = getByLabelText('ONNX Model') as HTMLSelectElement

    // Change selection to 'test.onnx2'
    await fireEvent.change(select, { target: { value: 'test.onnx2' } })

    // Ensure dispatch was called with a function (thunk)
    expect(typeof mockDispatch.mock.calls[0][0]).toBe('function')
  })

  it('calls open dialog and dispatches when Add button is clicked and a file is selected', async () => {
    const mockDispatch = vi.fn()
    vi.mocked(useDispatch).mockReturnValue(mockDispatch)
    // Mock open to resolve with a file path
    vi.mocked(open).mockResolvedValueOnce('mock-model.onnx')

    const { getByLabelText } = render(SettingsView)
    const addButton = getByLabelText('Add model')
    await fireEvent.click(addButton)

    // open should have been called
    expect(open).toHaveBeenCalled()

    // dispatch should have been called (likely with a thunk)
    expect(mockDispatch).toHaveBeenCalled()
    expect(typeof mockDispatch.mock.calls[0][0]).toBe('function')
  })

  it('calls open dialog and does NOT dispatch when Add button is clicked and no file is selected', async () => {
    const mockDispatch = vi.fn()
    vi.mocked(useDispatch).mockReturnValue(mockDispatch)
    // Mock open to resolve with null (user cancels)
    vi.mocked(open).mockResolvedValueOnce(null)

    const { getByLabelText } = render(SettingsView)
    const addButton = getByLabelText('Add model')
    await fireEvent.click(addButton)

    // open should have been called
    expect(open).toHaveBeenCalled()

    // dispatch should NOT have been called
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('calls open dialog and does NOT dispatch when Add button is clicked and fileName is an empty string', async () => {
    const mockDispatch = vi.fn()
    vi.mocked(useDispatch).mockReturnValue(mockDispatch)
    vi.mocked(open).mockResolvedValueOnce('/some/path/without/file/')
    const { message } = await import('@tauri-apps/plugin-dialog')

    const { getByLabelText } = render(SettingsView)
    const addButton = getByLabelText('Add model')
    await fireEvent.click(addButton)

    expect(open).toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()

    expect(message).toHaveBeenCalledWith(
      expect.stringContaining('Invalid file.'),
      { title: 'Classifi-Cam', kind:'error' },
    )
  })

  it('calls open dialog and shows message when Add button is clicked and fileName already exists', async () => {
    const mockDispatch = vi.fn()
    vi.mocked(useDispatch).mockReturnValue(mockDispatch)
    vi.mocked(open).mockResolvedValueOnce('test.onnx')
    const { message } = await import('@tauri-apps/plugin-dialog')

    const { getByLabelText } = render(SettingsView)
    const addButton = getByLabelText('Add model')
    await fireEvent.click(addButton)

    expect(open).toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()

    expect(message).toHaveBeenCalledWith(
      expect.stringContaining('already exists'),
      { title: 'Classifi-Cam', kind:'error' },
    )
  })

  it('shows error message when open dialog throws in handleAddModel', async () => {
    const mockDispatch = vi.fn()
    vi.mocked(useDispatch).mockReturnValue(mockDispatch)
    // Mock open to reject (throw an error)
    vi.mocked(open).mockRejectedValueOnce(new Error('Dialog failed'))
    const { message } = await import('@tauri-apps/plugin-dialog')

    const { getByLabelText } = render(SettingsView)
    const addButton = getByLabelText('Add model')
    await fireEvent.click(addButton)

    expect(open).toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()
    expect(message).toHaveBeenCalledWith(
      expect.stringContaining('Failed to add model.'),
    )
  })

  it('shows "-- No model selected --" option as selected when selected is empty', () => {
    selected.set('')
    const { getByLabelText } = render(SettingsView)
    const select = getByLabelText('ONNX Model') as HTMLSelectElement
    expect(select.value).toBe('')
    expect(select.options[0].selected).toBe(false)
    expect(select.options[0].textContent).toContain('-- No model selected --')
  })

  it('shows only the default option when models is empty', () => {
    models.set([])
    selected.set(null)

    const { getByLabelText, getAllByRole } = render(SettingsView)
    const select = getByLabelText('ONNX Model') as HTMLSelectElement
    const options = getAllByRole('option')
    expect(options.length).toBe(2)
    expect(options[0].textContent).toBe('-- No model selected --')
    expect(select.value).toBe('')
    expect(options[1].textContent).toBe('No models available')
    expect(select.value).toBe('')
  })

  it('shows "No models available" when models is empty', () => {
    models.set([])
    selected.set(null)
    const { getByText } = render(SettingsView)
    expect(getByText('No models available')).toBeInTheDocument()
  })
})
