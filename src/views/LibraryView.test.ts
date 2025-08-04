import { describe, it, expect, vi } from 'vitest'
import { render, waitFor, fireEvent } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import LibraryView from './LibraryView.svelte'
import { useDispatch } from '../store'
import { writable } from 'svelte/store'
import { type Detection, type Timing } from '../store/appSlice'

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

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(() => Promise.resolve({
    timing: timing,
    detections: detections,
  })),
}))

describe('LibraryView Component', () => {
  beforeAll(() => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]), // or whatever your component expects
        text: () => Promise.resolve(''),
        blob: () => Promise.resolve(new Blob()),
        headers: new Headers(),
        redirected: false,
        status: 200,
        statusText: 'OK',
        type: 'basic',
        url: '',
        clone: () => this,
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        formData: () => Promise.resolve(new FormData()),
      } as unknown as Response),
    ) as unknown as typeof fetch
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('should load image filenames and render their previews', async () => {
    const { getByAltText, getByText } = render(LibraryView)
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

  it('should render all image previews with correct alt and src attributes', async () => {
    const { getAllByRole } = render(LibraryView)
    await waitFor(() => {
      const images = getAllByRole('img')
      expect(images.length).toBeGreaterThanOrEqual(6)
      images.forEach((img) => {
        expect(img).toHaveAttribute('src')
        expect(img).toHaveAttribute('alt')
      })
    })
  })

  it('should call handleImageClick and dispatch when any image button is clicked', async () => {
    const mockDispatch = vi.fn()
    vi.mocked(useDispatch).mockReturnValue(mockDispatch)

    const { getAllByTestId } = render(LibraryView)
    const buttons = await waitFor(() => getAllByTestId(/^btn-/))
    expect(buttons.length).toBeGreaterThanOrEqual(1)
    expect(buttons.length).toBe(6)
    await fireEvent.click(buttons[0])
    await waitFor(() => { expect(mockDispatch).toHaveBeenCalled() })
    await fireEvent.click(buttons[1])
    await waitFor(() => { expect(mockDispatch).toHaveBeenCalled() })
  })

  it('should display the correct number of images and filenames', async () => {
    const { getAllByRole, getAllByText } = render(LibraryView)
    await waitFor(() => {
      const images = getAllByRole('img')
      expect(images.length).toBe(6)
      const filenames = [
        'bailey.jpeg',
        'ingredients4.jpg',
        'ingredients6.jpg',
        'ingredients7.jpg',
        'ingredients8.jpg',
        'ingredients9.jpg',
      ]
      filenames.forEach((name) => {
        expect(getAllByText(name)[0]).toBeInTheDocument()
      })
    })
  })

  it('should have accessible buttons for each image', async () => {
    const { getAllByRole } = render(LibraryView)
    await waitFor(() => {
      const buttons = getAllByRole('button')
      expect(buttons.length).toBe(6)
      buttons.forEach((btn) => {
        expect(btn).toHaveAttribute('aria-label')
      })
    })
  })
})
