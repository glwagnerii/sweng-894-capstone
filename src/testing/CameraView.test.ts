/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import { render, waitFor } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import CameraView from '../views/CameraView.svelte'

describe('CameraView Component', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('when camera access is granted', () => {
    beforeAll(() => {
      Object.defineProperty(global.navigator, 'mediaDevices', {
        writable: true,
        value: {
          getUserMedia: vi.fn().mockResolvedValue({
            getTracks: () => [{ stop: vi.fn() }],
          }),
        },
      })
    })

    it('should render the video element for the camera feed', async () => {
      const { container } = render(CameraView)
      const video = container.querySelector('video')
      expect(video).toBeInTheDocument()
      expect(video).toHaveAttribute('autoplay')
      expect(video).toHaveAttribute('playsinline')
    })
  })

  describe('when camera access is denied (try-catch block)', () => {
    beforeAll(() => {
      Object.defineProperty(global.navigator, 'mediaDevices', {
        writable: true,
        value: {
          getUserMedia: vi.fn().mockRejectedValue(new Error('Permission denied')),
        },
      })
    })

    it('should display an error message if camera access is denied', async () => {
      const { getByText, queryByRole } = render(CameraView)
      await waitFor(() => {
        expect(getByText(/Camera access denied or error:/)).toBeInTheDocument()
      })
      // Video should not be rendered
      expect(queryByRole('video')).not.toBeInTheDocument()
    })
  })

  describe('when getUserMedia throws a non-Error', () => {
    beforeAll(() => {
      Object.defineProperty(global.navigator, 'mediaDevices', {
        writable: true,
        value: {
          getUserMedia: vi.fn().mockRejectedValue('some string error'),
        },
      })
    })

    it('should display a generic error message for unknown errors', async () => {
      const { getByText } = render(CameraView)
      await waitFor(() => {
        expect(getByText(/Camera access denied or unknown error/)).toBeInTheDocument()
      })
    })
  })
})
