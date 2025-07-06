/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, waitFor } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import { CameraView } from '../views'

const mockDevices = [
  { deviceId: '1', kind: 'videoinput', label: 'Front Camera' },
  { deviceId: '2', kind: 'videoinput', label: 'Back Camera' },
]

describe('CameraView Component', () => {
  let mockGetUserMedia: ReturnType<typeof vi.fn>
  let mockEnumerateDevices: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockGetUserMedia = vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    })

    mockEnumerateDevices = vi.fn().mockResolvedValue(mockDevices)

    Object.defineProperty(global.navigator, 'mediaDevices', {
      writable: true,
      value: {
        getUserMedia: mockGetUserMedia,
        enumerateDevices: mockEnumerateDevices,
      },
    })

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: vi.fn(),
        getItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // it('displays a generic error if getUserMedia fails with unknown type', async () => {
  //   Object.defineProperty(global.navigator, 'mediaDevices', {
  //     writable: true,
  //     value: {
  //       getUserMedia: vi.fn().mockRejectedValue('unknown camera error'),
  //       enumerateDevices: vi.fn().mockResolvedValue([]),
  //     },
  //   })

  //   const { getByText } = render(CameraView)

  //   await waitFor(() => {
  //     expect(
  //       getByText((content) => content.toLowerCase().includes('error')),
  //     ).toBeInTheDocument()
  //   })
  // })

  it('shows camera select dropdown on desktop if multiple devices', async () => {
    const { getByLabelText, getAllByRole } = render(CameraView)

    await waitFor(() => {
      expect(getByLabelText(/Select Camera/i)).toBeInTheDocument()
    })

    const options = getAllByRole('option')
    expect(options.length).toBe(2)
    expect(options[0]).toHaveTextContent('Front Camera')
  })

  it('displays an error if getUserMedia fails with known error', async () => {
    navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue(new Error('Permission denied'))
    const { getByText } = render(CameraView)

    await waitFor(() => {
      expect(getByText(/Camera error: Permission denied/i)).toBeInTheDocument()
    })
  })

  it('displays a generic error if getUserMedia fails with unknown type', async () => {
    navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue('unknown string')
    const { getByText } = render(CameraView)

    await waitFor(() => {
      expect(
        getByText((content) => content.toLowerCase().includes('error')),
      ).toBeInTheDocument()
    })
  })

  // it('takes a photo and shows the preview when Take Photo is clicked', async () => {
  //   const { getByText, container } = render(CameraView)

  //   await waitFor(() => {
  //     const button = getByText(/Take Photo/i)
  //     expect(button).toBeInTheDocument()
  //   })

  //   // Fake dimensions for canvas drawing
  //   Object.defineProperty(HTMLVideoElement.prototype, 'videoWidth', { value: 640 })
  //   Object.defineProperty(HTMLVideoElement.prototype, 'videoHeight', { value: 480 })

  //   const canvas = container.querySelector('canvas') as HTMLCanvasElement
  //   const ctx = canvas.getContext('2d')
  //   vi.spyOn(canvas, 'getContext').mockReturnValue(ctx)

  //   const takeButton = getByText(/Take Photo/i)
  //   await fireEvent.click(takeButton)

  //   await waitFor(() => {
  //     expect(container.querySelector('img')).toBeInTheDocument()
  //     expect(getByText(/Confirm/i)).toBeInTheDocument()
  //     expect(getByText(/Retake/i)).toBeInTheDocument()
  //   })
  // })

  // it('confirms photo and saves to localStorage', async () => {
  //   const { getByText, container } = render(CameraView)

  //   // Mock canvas interaction
  //   Object.defineProperty(HTMLVideoElement.prototype, 'videoWidth', { value: 640 })
  //   Object.defineProperty(HTMLVideoElement.prototype, 'videoHeight', { value: 480 })
  //   const canvas = container.querySelector('canvas') as HTMLCanvasElement
  //   const ctx = canvas.getContext('2d')
  //   vi.spyOn(canvas, 'getContext').mockReturnValue(ctx)

  //   await fireEvent.click(getByText(/Take Photo/i))

  //   await waitFor(() => {
  //     expect(container.querySelector('img')).toBeInTheDocument()
  //   })

  //   const confirmButton = getByText(/Confirm/i)
  //   await fireEvent.click(confirmButton)

  //   expect(localStorage.setItem).toHaveBeenCalled()
  // })

  // it('retakes photo and returns to video view', async () => {
  //   const { getByText, queryByText, container } = render(CameraView)

  //   // Mock canvas interaction
  //   Object.defineProperty(HTMLVideoElement.prototype, 'videoWidth', { value: 640 })
  //   Object.defineProperty(HTMLVideoElement.prototype, 'videoHeight', { value: 480 })
  //   const canvas = container.querySelector('canvas') as HTMLCanvasElement
  //   const ctx = canvas.getContext('2d')
  //   vi.spyOn(canvas, 'getContext').mockReturnValue(ctx)

  //   await fireEvent.click(getByText(/Take Photo/i))

  //   await waitFor(() => {
  //     expect(container.querySelector('img')).toBeInTheDocument()
  //   })

  //   const retakeButton = getByText(/Retake/i)
  //   await fireEvent.click(retakeButton)

  //   await waitFor(() => {
  //     expect(queryByText(/Confirm/i)).not.toBeInTheDocument()
  //     expect(container.querySelector('video')).toBeInTheDocument()
  //   })
  // })
})
