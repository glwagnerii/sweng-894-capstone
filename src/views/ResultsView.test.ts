/// <reference types="vitest/globals" />
import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import { ResultView } from '../views'
import type { Timing, Detection } from '../store/appSlice'
import { writable } from 'svelte/store'
import { useDispatch } from '../store'

// Mock the selectors as writable stores
const name = writable('test.png')
const base64 = writable('data:image/png;base64,FAKEBASE64DATA')
const detections = writable([
  { class: 'Onion', score: 0.9, bbox: [0, 0, 10, 10] },
  { class: 'Garlic', score: 0.8, bbox: [10, 10, 20, 20] },
  { class: 'Tomato', score: 0.7, bbox: [20, 20, 30, 30] },
] as Detection[])
const timing = writable({ load: 1, init: 2, resize: 3, pad: 4, tensor: 5, infer: 6, bbox: 7, nms: 8, total: 36 } as Timing)

vi.mock('../store', () => ({
  useSelector: (fn: (state: unknown) => unknown) => {
    if (fn.toString().includes('name')) return name
    if (fn.toString().includes('base64')) return base64
    if (fn.toString().includes('detections')) return detections
    if (fn.toString().includes('timing')) return timing
    return writable(null)
  },
  useDispatch: vi.fn(),
}))

describe('ResultView Component', () => {
  it('should display the image preview and detection buttons', async () => {
    const { getByAltText, getByText } = render(ResultView)

    // Validate the image preview
    const image = getByAltText('Detected Item')
    await fireEvent.load(image)

    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'data:image/png;base64,FAKEBASE64DATA')

    // Validate detection/classification buttons
    expect(getByText('Onion')).toBeInTheDocument()
    expect(getByText('Garlic')).toBeInTheDocument()
    expect(getByText('Tomato')).toBeInTheDocument()
  })

  it('should display timing data when present', async () => {
    const { getByText, container } = render(ResultView)
    const checkbox = container.querySelector('.collapse input[type="checkbox"]') as HTMLInputElement
    await fireEvent.click(checkbox)

    // Validate timing data is rendered
    expect(getByText('Inference Timing (36 ms)')).toBeInTheDocument()
    expect(getByText('Image Load:')).toBeInTheDocument()
    expect(getByText('1 ms')).toBeInTheDocument()
    expect(getByText('Model Init:')).toBeInTheDocument()
    expect(getByText('2 ms')).toBeInTheDocument()
    expect(getByText('Resize:')).toBeInTheDocument()
    expect(getByText('3 ms')).toBeInTheDocument()
    expect(getByText('Padding:')).toBeInTheDocument()
    expect(getByText('4 ms')).toBeInTheDocument()
    expect(getByText('ToTensor:')).toBeInTheDocument()
    expect(getByText('5 ms')).toBeInTheDocument()
    expect(getByText('Inference:')).toBeInTheDocument()
    expect(getByText('6 ms')).toBeInTheDocument()
    expect(getByText('BBox:')).toBeInTheDocument()
    expect(getByText('7 ms')).toBeInTheDocument()
    expect(getByText('NMS:')).toBeInTheDocument()
    expect(getByText('8 ms')).toBeInTheDocument()
  })

  it('should dispatch viewMatches action when a detection button is clicked', async () => {
    const mockDispatch = vi.fn()
    vi.mocked(useDispatch).mockReturnValue(mockDispatch)

    const { getByText } = render(ResultView)

    const garlicButton = getByText('Garlic')
    await fireEvent.click(garlicButton)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'app/viewMatches',
      payload: { name: 'Garlic' },
    })
  })

  it('should render correctly when there are no detections', () => {
    // Set detections to empty
    detections.set([])

    const { getByAltText, queryByText, container } = render(ResultView)

    // Image should still be present
    const image = getByAltText('Detected Item')
    expect(image).toBeInTheDocument()

    // Detection buttons should not be present
    expect(queryByText('Onion')).not.toBeInTheDocument()
    expect(queryByText('Garlic')).not.toBeInTheDocument()
    expect(queryByText('Tomato')).not.toBeInTheDocument()

    // SVG with bounding boxes should not be present
    const svg = container.querySelector('svg')
    expect(svg).not.toBeInTheDocument()
  })
})
