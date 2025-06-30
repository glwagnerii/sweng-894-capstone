/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import ResultView from '../views/ResultView.svelte'
import * as store from '../store'

// Mock the store module
vi.mock('../store', () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}))

describe('ResultView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display the image preview and classification tags', () => {
    // Mock useSelector for imageSrc
    vi.mocked(store.useSelector)
      .mockImplementationOnce(() => ({
        subscribe: (fn: (value: string) => void) => {
          fn('test-image.png')
          return () => {}
        },
      }))
      // Mock useSelector for classifications
      .mockImplementationOnce(() => ({
        subscribe: (fn: (value: string[]) => void) => {
          fn(['Onion', 'Garlic', 'Tomato'])
          return () => {}
        },
      }))

    const { getByAltText, getByText } = render(ResultView)

    // Validate the image preview
    const image = getByAltText('Classified Item')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'test-image.png')

    // Validate classification tags
    expect(getByText('Onion')).toBeInTheDocument()
    expect(getByText('Garlic')).toBeInTheDocument()
    expect(getByText('Tomato')).toBeInTheDocument()
  })
})
