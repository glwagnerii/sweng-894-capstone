import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'

import { EditableField }  from './'

describe('EditableField', () => {
  const defaultProps = {
    id: 'test-field',
    label: 'Test Label',
    value: 'Test Value',
    onSave: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders label and value in non-editing mode', () => {
    render(EditableField, { props: defaultProps })

    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByText('Test Value')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '✏️' })).toBeInTheDocument()
  })

  it('switches to editing mode when edit button is clicked', async () => {
    render(EditableField, { props: defaultProps })

    const editButton = screen.getByRole('button', { name: '✏️' })
    await fireEvent.click(editButton)

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '✔️' })).toBeInTheDocument()
    expect(screen.queryByText('Test Value')).not.toBeInTheDocument()
  })

  it('calls onSave when save button is clicked', async () => {
    const onSave = vi.fn()
    render(EditableField, { props: { ...defaultProps, onSave } })

    const editButton = screen.getByRole('button', { name: '✏️' })
    await fireEvent.click(editButton)

    const input = screen.getByRole('textbox')
    await fireEvent.input(input, { target: { value: 'New Value' } })

    const saveButton = screen.getByRole('button', { name: '✔️' })
    await fireEvent.click(saveButton)

    expect(onSave).toHaveBeenCalledWith('New Value')
  })

  it('calls onSave when Enter key is pressed in input', async () => {
    const onSave = vi.fn()
    render(EditableField, { props: { ...defaultProps, onSave } })

    const editButton = screen.getByRole('button', { name: '✏️' })
    await fireEvent.click(editButton)

    const input = screen.getByRole('textbox')
    await fireEvent.input(input, { target: { value: 'New Value' } })
    await fireEvent.keyDown(input, { key: 'Enter' })

    expect(onSave).toHaveBeenCalledWith('New Value')
  })

  it('trims whitespace when saving', async () => {
    const onSave = vi.fn()
    render(EditableField, { props: { ...defaultProps, onSave } })

    const editButton = screen.getByRole('button', { name: '✏️' })
    await fireEvent.click(editButton)

    const input = screen.getByRole('textbox')
    await fireEvent.input(input, { target: { value: '  Trimmed Value  ' } })

    const saveButton = screen.getByRole('button', { name: '✔️' })
    await fireEvent.click(saveButton)

    expect(onSave).toHaveBeenCalledWith('Trimmed Value')
  })

  it('exits editing mode after saving', async () => {
    render(EditableField, { props: defaultProps })

    const editButton = screen.getByRole('button', { name: '✏️' })
    await fireEvent.click(editButton)

    const saveButton = screen.getByRole('button', { name: '✔️' })
    await fireEvent.click(saveButton)

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '✏️' })).toBeInTheDocument()
  })

  it('sets correct id attribute on input when editing', async () => {
    render(EditableField, { props: defaultProps })

    const editButton = screen.getByRole('button', { name: '✏️' })
    await fireEvent.click(editButton)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'test-field')
  })
})
