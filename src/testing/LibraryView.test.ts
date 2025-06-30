/// <reference types="vitest/globals" />
import { describe, it, expect } from 'vitest'
import { render, waitFor } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import LibraryView from '../views/LibraryView.svelte'

describe('LibraryView Component', () => {
  it('should load image filenames and render their previews', async () => {
    const { getByAltText, getByText } = render(LibraryView)

    // Wait for images to be processed and rendered after onMount
    await waitFor(() => {
      expect(getByAltText('ingredients4.jpg')).toBeInTheDocument()
      expect(getByText('ingredients4.jpg')).toBeInTheDocument()

      expect(getByAltText('ingredients6.jpg')).toBeInTheDocument()
      expect(getByText('ingredients6.jpg')).toBeInTheDocument()

      expect(getByAltText('ingredients7.jpg')).toBeInTheDocument()
      expect(getByText('ingredients7.jpg')).toBeInTheDocument()

      expect(getByAltText('ingredients8.jpg')).toBeInTheDocument()
      expect(getByText('ingredients8.jpg')).toBeInTheDocument()

      expect(getByAltText('ingredients9.jpg')).toBeInTheDocument()
      expect(getByText('ingredients9.jpg')).toBeInTheDocument()
    })
  })
})
