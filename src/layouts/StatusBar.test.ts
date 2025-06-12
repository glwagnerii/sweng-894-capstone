/// <reference types="vitest/globals" />
import { vi } from 'vitest'

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import StatusBar from './StatusBar.svelte' // Update path as needed

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
  it('renders all buttons', () => {
    const { getByText } = render(StatusBar)
    expect(getByText('Camera')).toBeTruthy()
    expect(getByText('Library')).toBeTruthy()
    expect(getByText('Results')).toBeTruthy()
    expect(getByText('Recipe')).toBeTruthy()
    expect(getByText('HTTP')).toBeTruthy()
    expect(getByText('Models')).toBeTruthy()
  })

  it('calls open and message when Models button is clicked', async () => {
    const { getByText } = render(StatusBar)
    const { open, message } = await getDialogMocks()
    await fireEvent.click(getByText('Models'))
    expect(open).toHaveBeenCalledWith({ multiple: false, directory: false })
    expect(message).toHaveBeenCalledWith('You selected: mock-file', { title: 'Classifi-Cam', kind: 'info' })
  })
})
