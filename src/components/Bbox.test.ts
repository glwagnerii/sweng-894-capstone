import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'

import { Bbox } from './'
import type { Detection } from '../store/appSlice'

describe('Bbox Component', () => {
  const mockDetection: Detection = {
    bbox: [0.1, 0.2, 0.3, 0.4],
    class: 'Car',
    score: 0.85,
  }
  const mockImgEl = document.createElement('img')

  // Set up mock dimensions
  Object.defineProperty(mockImgEl, 'width', { value: 800 })
  Object.defineProperty(mockImgEl, 'naturalWidth', { value: 1600 })
  Object.defineProperty(mockImgEl, 'height', { value: 600 })
  Object.defineProperty(mockImgEl, 'naturalHeight', { value: 1200 })

  beforeEach(() => {
    (Element.prototype as SVGTextElement).getComputedTextLength = vi.fn().mockReturnValue(50)
  })

  it('renders without crashing', async () => {
    const { container } = render(Bbox, { props: { det: mockDetection, imgEl: mockImgEl } })
    expect(container).toBeTruthy()
  })

  it('renders bounding box rectangle with correct scaled dimensions', () => {
    const { container } = render(Bbox, { props: { det: mockDetection, imgEl: mockImgEl } })

    const rects = container.querySelectorAll('rect')
    const boundingRect = rects[0]

    // scalex = 800/1600 = 0.5, scaley = 600/1200 = 0.5
    expect(boundingRect).toHaveAttribute('x', '0.05')
    expect(boundingRect).toHaveAttribute('y', '0.1')
    expect(boundingRect).toHaveAttribute('width', '0.15')
    expect(boundingRect).toHaveAttribute('height', '0.2')
    expect(boundingRect).toHaveClass('fill-none', 'stroke-red-500', 'stroke-2')
  })

  it('renders label text with correct content and position', () => {
    const { container } = render(Bbox, { props: { det: mockDetection, imgEl: mockImgEl } })

    const text = container.querySelector('text')

    expect(text).toHaveAttribute('x', '8.05')
    expect(text).toHaveAttribute('y', '12.1')
    expect(text).toHaveTextContent('Car (85%)')
    expect(text).toHaveClass('fill-white', 'text-[15px]', 'font-medium', 'drop-shadow')
  })

  it('handles score expression with edge case values', () => {
    const edgeCases = [
      { score: 0, expected: '0' },
      { score: 0.005, expected: '1' },
      { score: 0.876543, expected: '88' },
      { score: 1.0, expected: '100' },
    ]

    edgeCases.forEach(({ score, expected }) => {
      const detection: Detection = {
        bbox: [0.1, 0.2, 0.3, 0.4],
        class: 'Test',
        score,
      }

      const { container } = render(Bbox, { props: { det: detection, imgEl: mockImgEl } })
      const text = container.querySelector('text')

      expect(text?.textContent).toContain(`(${expected}%)`)
    })
  })

  it('handles null image element - calculates zero scale factors', () => {
    const { container } = render(Bbox, { props: { det: mockDetection, imgEl: null } })

    const boundingRect = container.querySelector('rect')

    expect(boundingRect).toHaveAttribute('x', '0')
    expect(boundingRect).toHaveAttribute('y', '0')
    expect(boundingRect).toHaveAttribute('width', '0')
    expect(boundingRect).toHaveAttribute('height', '0')
  })

  it('handles image with missing dimensions', () => {
    const imgElMissing = document.createElement('img')
    // No properties set - all undefined

    const { container } = render(Bbox, { props: { det: mockDetection, imgEl: imgElMissing } })

    const boundingRect = container.querySelector('rect')
    expect(boundingRect).toHaveAttribute('x', '0')
    expect(boundingRect).toHaveAttribute('y', '0')
    expect(boundingRect).toHaveAttribute('width', '0')
    expect(boundingRect).toHaveAttribute('height', '0')
  })

  it('handles different aspect ratios correctly', () => {
    const imgElWide = document.createElement('img')
    Object.defineProperty(imgElWide, 'width', { value: 400 })
    Object.defineProperty(imgElWide, 'naturalWidth', { value: 800 })
    Object.defineProperty(imgElWide, 'height', { value: 600 })
    Object.defineProperty(imgElWide, 'naturalHeight', { value: 300 })

    const { container } = render(Bbox, { props: { det: mockDetection, imgEl: imgElWide } })

    const boundingRect = container.querySelector('rect')

    // scalex = 0.5, scaley = 2
    expect(boundingRect).toHaveAttribute('x', '0.05')
    expect(boundingRect).toHaveAttribute('y', '0.4')
    expect(boundingRect).toHaveAttribute('width', '0.15')
    expect(boundingRect).toHaveAttribute('height', '0.8')
  })

  it('renders label background rectangle with correct position', () => {
    const { container } = render(Bbox, { props: { det: mockDetection, imgEl: mockImgEl } })

    const rects = container.querySelectorAll('rect')
    const labelRect = rects[1]

    expect(labelRect).toHaveAttribute('x', '0.05')
    expect(labelRect).toHaveAttribute('y', '0.1')
    expect(labelRect).toHaveAttribute('height', '16')
    expect(labelRect).toHaveClass('fill-red-500', 'opacity-60', 'rounded')
  })

  it('updates label width after mount', async () => {
    const { container } = render(Bbox, { props: { det: mockDetection, imgEl: mockImgEl } })

    // Wait for onMount to execute
    await new Promise((resolve) => setTimeout(resolve, 0))

    const labelRect = container.querySelectorAll('rect')[1]
    expect(labelRect).toHaveAttribute('width', '64') // getComputedTextLength (50) + 14
  })

  it('handles empty class name', () => {
    const detectionWithEmptyClass: Detection = {
      bbox: [0.1, 0.2, 0.3, 0.4],
      class: '',
      score: 0.75,
    }

    const { container } = render(Bbox, { props: { det: detectionWithEmptyClass, imgEl: mockImgEl } })
    const text = container.querySelector('text')

    expect(text?.textContent).toContain('(75%)')
  })
})
