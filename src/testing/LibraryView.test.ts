/// <reference types="vitest/globals" />
import { describe, it, expect, vi } from 'vitest'
import { render, waitFor } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import LibraryView from '../views/LibraryView.svelte'

// Mocking Tauri FS plugin methods to simulate reading images from the app's local directory
vi.mock('@tauri-apps/plugin-fs', async () => {
  return {
    readDir: vi.fn().mockResolvedValue([
      { name: 'example.jpg' },
      { name: 'test.png' },
    ]),
    readFile: vi.fn().mockResolvedValue(new Uint8Array([137, 80, 78, 71])), // Simulate binary file data
    BaseDirectory: { Resource: 'resource' },
  }
})

describe('LibraryView Component', () => {
  it('should load image filenames and render their previews', async () => {
    const { getByAltText, getByText } = render(LibraryView)

    // Wait for images to be processed and rendered after onMount
    await waitFor(() => {
      expect(getByAltText('example.jpg')).toBeInTheDocument()
      expect(getByText('example.jpg')).toBeInTheDocument()

      expect(getByAltText('test.png')).toBeInTheDocument()
      expect(getByText('test.png')).toBeInTheDocument()
    })
  })

  it('should call readDir and readFile for each image', async () => {
    const { readDir, readFile } = await import('@tauri-apps/plugin-fs')
    render(LibraryView)
    await waitFor(() => {
      expect(readDir).toHaveBeenCalledWith('resources/images', { baseDir: 'resource' })
      expect(readFile).toHaveBeenCalledTimes(2)
      expect(readFile).toHaveBeenCalledWith('resources/images/example.jpg', { baseDir: 'resource' })
      expect(readFile).toHaveBeenCalledWith('resources/images/test.png', { baseDir: 'resource' })
    })
  })

  it('should handle errors in loadFilenames and log them', async () => {
    const error = new Error('readDir failed')
    const { readDir } = await import('@tauri-apps/plugin-fs')

    // @ts-ignore
    readDir.mockRejectedValueOnce(error)
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(LibraryView)
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load filenames', error)
    })

    consoleErrorSpy.mockRestore()
  })
})
