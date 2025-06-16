/// <reference types="vitest/globals" />
import { vi } from 'vitest'

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import { StatusBar } from './'

// Mock tauri dialog plugin
vi.mock('@tauri-apps/plugin-dialog', () => ({
  open: vi.fn(() => Promise.resolve('mock-file')),
  message: vi.fn(() => Promise.resolve()),
}))

const getDialogMocks = async () => {
  const dialog = await import('@tauri-apps/plugin-dialog')
  return { open: dialog.open, message: dialog.message }
}

describe('StatusBar', () => {
  it('renders an view camera button', () => {
    const { container } = render(StatusBar)
    const btn = container.querySelector('.btn-viewCamera')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveTextContent('Camera')
  })

  it('renders an view library button', () => {
    const { container } = render(StatusBar)
    const btn = container.querySelector('.btn-viewLibrary')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveTextContent('Library')
  })

  it('renders an view results button', () => {
    const { container } = render(StatusBar)
    const btn = container.querySelector('.btn-viewResult')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveTextContent('Results')
  })

  it('renders an view reciope button', () => {
    const { container } = render(StatusBar)
    const btn = container.querySelector('.btn-viewRecipe')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveTextContent('Recipe')
  })

  it('renders an view http button', () => {
    const { container } = render(StatusBar)
    const btn = container.querySelector('.btn-viewHttp')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveTextContent('HTTP')
  })

  it('renders an view http button', () => {
    const { container } = render(StatusBar)
    const btn = container.querySelector('.btn-openFolder')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveTextContent('Models')
  })

  it('calls open and message dialogs when Models button is clicked', async () => {
    const { getByText } = render(StatusBar)
    const { open, message } = await getDialogMocks()
    await fireEvent.click(getByText('Models'))
    expect(open).toHaveBeenCalledWith({ multiple: false, directory: false })
    expect(message).toHaveBeenCalledWith('You selected: mock-file', { title: 'Classifi-Cam', kind: 'info' })
  })
})
