/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import { ResultView } from '../views'
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

  it('should display the image preview and detection buttons', () => {
    // Mock useSelector for name, base64, and detections
    vi.mocked(store.useSelector)
      .mockImplementationOnce(() => ({
        subscribe: (fn: (value: string) => void) => {
          fn('capturedPhoto')
          return () => {}
        },
      }))
      .mockImplementationOnce(() => ({
        subscribe: (fn: (value: string) => void) => {
          fn('data:image/png;base64,FAKEBASE64DATA')
          return () => {}
        },
      }))
      .mockImplementationOnce(() => ({
        subscribe: (fn: (value: { class: string, score: number, bbox: number[] }[]) => void) => {
          fn([
            { class: 'Onion', score: 0.9, bbox: [0, 0, 10, 10] },
            { class: 'Garlic', score: 0.8, bbox: [10, 10, 20, 20] },
            { class: 'Tomato', score: 0.7, bbox: [20, 20, 30, 30] },
          ])
          return () => {}
        },
      }))

    const { getByAltText, getByText } = render(ResultView)

    // Validate the image preview
    const image = getByAltText('Detected Item')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'data:image/png;base64,FAKEBASE64DATA')

    // Validate detection/classification buttons
    expect(getByText('Onion')).toBeInTheDocument()
    expect(getByText('Garlic')).toBeInTheDocument()
    expect(getByText('Tomato')).toBeInTheDocument()
  })
})
