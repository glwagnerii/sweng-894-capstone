import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

import { SearchBox } from './'

describe('SearchBox', () => {
  const defaultProps = {
    id: 'test-search',
    label: 'Test Label',
    options: ['Apple', 'Banana', 'Cherry', 'Date'],
    value: '',
    placeholder: 'Type to search...',
    onSearch: vi.fn(),
  }

  it('renders with label and placeholder', () => {
    render(SearchBox, { props: defaultProps })

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  it('shows filtered options when input is focused', async () => {
    render(SearchBox, { props: defaultProps })

    const input = screen.getByRole('textbox')
    await fireEvent.focus(input)

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
    expect(screen.getByText('Cherry')).toBeInTheDocument()
    expect(screen.getByText('Date')).toBeInTheDocument()
  })

  it('filters options based on input value', async () => {
    render(SearchBox, { props: defaultProps })

    const input = screen.getByRole('textbox')
    await fireEvent.input(input, { target: { value: 'a' } })
    await fireEvent.focus(input)

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
    expect(screen.queryByText('Cherry')).not.toBeInTheDocument()
    expect(screen.getByText('Date')).toBeInTheDocument()
  })

  it('selects option when clicked', async () => {
    render(SearchBox, { props: defaultProps })

    const input = screen.getByRole('textbox')
    await fireEvent.focus(input)

    const appleOption = screen.getByText('Apple')
    await fireEvent.mouseDown(appleOption)

    expect(input).toHaveValue('Apple')
  })

  it('calls onSearch when search button is clicked', async () => {
    const onSearch = vi.fn()
    render(SearchBox, { props: { ...defaultProps, onSearch } })

    const searchButton = screen.getByRole('button', { name: 'Search' })
    await fireEvent.click(searchButton)

    expect(onSearch).toHaveBeenCalled()
  })

  it('renders without label when not provided', () => {
    const propsWithoutLabel = { ...defaultProps, label: '' }
    render(SearchBox, { props: propsWithoutLabel })

    expect(screen.queryByText('Test Label')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('handles Enter key press to blur input', async () => {
    render(SearchBox, { props: defaultProps })

    const input = screen.getByRole('textbox')
    await fireEvent.focus(input)
    await fireEvent.keyDown(input, { key: 'Enter' })

    expect(document.activeElement).not.toBe(input)
  })

  it('shows no options when filtered list is empty', async () => {
    render(SearchBox, { props: defaultProps })

    const input = screen.getByRole('textbox')
    await fireEvent.input(input, { target: { value: 'xyz' } })
    await fireEvent.focus(input)

    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
    expect(screen.queryByText('Banana')).not.toBeInTheDocument()
    expect(screen.queryByText('Cherry')).not.toBeInTheDocument()
    expect(screen.queryByText('Date')).not.toBeInTheDocument()
  })

  it('calls onSearch with current input value', async () => {
    const onSearch = vi.fn()
    render(SearchBox, { props: { ...defaultProps, onSearch } })

    const input = screen.getByRole('textbox')
    await fireEvent.input(input, { target: { value: 'test search' } })

    const searchButton = screen.getByRole('button', { name: 'Search' })
    await fireEvent.click(searchButton)

    expect(onSearch).toHaveBeenCalled()
  })

  it('maintains case-insensitive filtering', async () => {
    render(SearchBox, { props: defaultProps })

    const input = screen.getByRole('textbox')
    await fireEvent.input(input, { target: { value: 'APPLE' } })
    await fireEvent.focus(input)

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.queryByText('Banana')).not.toBeInTheDocument()
  })
})
