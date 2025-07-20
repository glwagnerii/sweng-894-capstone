/// <reference types="vitest/globals" />
import { vi } from 'vitest'

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import { StatusBar } from './'

// Mock tauri dialog plugin
vi.mock('@tauri-apps/plugin-dialog', () => ({
  open: vi.fn(() => Promise.resolve('mock-file')),
  message: vi.fn(() => Promise.resolve()),
}))

describe('StatusBar', () => {
  it('renders an view Camera button', () => {
    const { container } = render(StatusBar)
    const btn = container.querySelector('.btn-viewCamera')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveTextContent('Camera')
  })

  it('renders an view Library button', () => {
    const { container } = render(StatusBar)
    const btn = container.querySelector('.btn-viewLibrary')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveTextContent('Library')
  })

  it('renders an view Results button', () => {
    const { container } = render(StatusBar)
    const btn = container.querySelector('.btn-viewResults')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveTextContent('Results')
  })

  it('renders an view Recipe button', () => {
    const { container } = render(StatusBar)
    const btn = container.querySelector('.btn-viewMatches')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveTextContent('Recipe')
  })

  it('renders an view Details button', () => {
    const { container } = render(StatusBar)
    const btn = container.querySelector('.btn-viewDetails')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveTextContent('Details')
  })
})
