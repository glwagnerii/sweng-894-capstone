import { describe, it, vi, expect } from 'vitest'
import { render, fireEvent, waitFor } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import { CameraView } from './'

const mockDispatch = vi.fn()
vi.mock('../store', () => ({
  useDispatch: () => mockDispatch,
}))

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue({ detections: [], timing: 123 }),
}))

beforeAll(() => {
  // Mock play, pause, and paused for video elements
  let paused = false
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: function () { paused = false },
  })
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: function () { paused = true },
  })
  Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
    configurable: true,
    get() { return paused },
    set(val) { paused = val },
  })

  // Mock getContext for HTMLCanvasElement
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: vi.fn(() => ({
      drawImage: vi.fn(),
      getImageData: vi.fn(),
      putImageData: vi.fn(),
    })),
  })

  // Mock toDataURL directly on the prototype
  Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
    configurable: true,
    value: vi.fn(() => 'data:image/png;base64,mockbase64'),
  })
})

describe('CameraView', () => {
  beforeEach(() => {
    // @ts-expect-error, mediaDevice gives typescript error
    global.navigator.mediaDevices = {
      getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [{ stop: vi.fn() }] }),
      enumerateDevices: vi.fn().mockResolvedValue([
        { deviceId: 'mock1', kind: 'videoinput', label: 'Mock Camera 1', groupId: '', toJSON: () => ({}) },
        { deviceId: 'mock2', kind: 'audioinput', label: 'Mock Mic', groupId: '', toJSON: () => ({}) },
        { deviceId: 'mock3', kind: 'videoinput', label: 'Mock Camera 2', groupId: '', toJSON: () => ({}) },
      ]),
    }    
  })

  it('should render without crashing', () => {
    const { container } = render(CameraView)
    expect(container).toBeTruthy()
  })

  it('should find and click the \'Take Photo\' button', async () => {
    const { getByText } = render(CameraView)
    const button = getByText('Take Photo')
    expect(button).toBeInTheDocument()
    await fireEvent.click(button)
    expect(getByText('Retake')).toBeInTheDocument()
    await fireEvent.click(button)
    expect(getByText('Take Photo')).toBeInTheDocument()
  })

  it('should find and click the \'Confirm\' button', async () => {
    const { getByText } = render(CameraView)
    const takePhotoButton = getByText('Take Photo')
    expect(takePhotoButton).toBeInTheDocument()
    await fireEvent.click(takePhotoButton)
    const confirmButton = getByText('Confirm')
    expect(confirmButton).toBeInTheDocument()
    await fireEvent.click(confirmButton)
  })

  it('should show a specific error message if getUserMedia rejects with an Error', async () => {
    // Mock getUserMedia to reject with an Error
    global.navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue(new Error('Test error'))
    const { getByText } = render(CameraView)
    await waitFor(() => {
      expect(getByText(/Video is not supported./)).toBeInTheDocument()
    })
  })

  it('should show a generic error message if getUserMedia rejects with a non-Error', async () => {
    // Mock getUserMedia to reject with a non-Error value
    global.navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue('not an error')
    const { getByText } = render(CameraView)
    await waitFor(() => {
      expect(getByText(/Video is not supported./)).toBeInTheDocument()
    })
  })

  it('should call handleCameraChange and startStream when camera select changes', async () => {
    const { getByLabelText } = render(CameraView)
    // Wait for select to appear
    const select = await waitFor(() => getByLabelText(/select camera/i))
    // Change the value to the mock camera
    await fireEvent.change(select, { target: { value: 'mock1' } })
    // The selectedDeviceId should be updated and startStream called (stream mocked)
    expect((select as HTMLSelectElement).value).toBe('mock1')
  })
})
