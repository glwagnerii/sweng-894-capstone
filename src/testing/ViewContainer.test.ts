/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest'
import { render, waitFor } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest' // Enables toBeInTheDocument

import { ViewContainer } from '../layouts'

import { store } from '../store/store'
import { appSlice } from '../store/appSlice'

// Mock mediaDevices for CameraView test
beforeAll(() => {
  Object.defineProperty(global.navigator, 'mediaDevices', {
    writable: true,
    value: {
      getUserMedia: vi.fn().mockResolvedValue({
        getTracks: () => [{ stop: vi.fn() }],
      }),
      enumerateDevices: vi.fn().mockResolvedValue([
        { kind: 'videoinput', deviceId: 'mock-device', label: 'Mock Camera' },
      ]),
    },
  })
})

// Mock Tauri readDir and readFile for LibraryView test
vi.mock('@tauri-apps/plugin-fs', () => ({
  readDir: vi.fn().mockResolvedValue([{ name: 'mockImage.jpg' }]),
  readFile: vi.fn().mockResolvedValue(new Uint8Array([137, 80, 78, 71])), // PNG signature
  BaseDirectory: { Resource: 'resource' },
}))

describe('ViewContainer Component – Navigation Flow', () => {
  // Reset app store view state before each test
  beforeEach(() => {
    store.dispatch(appSlice.actions.setView({ selected: 'home', visible: true }))
  })

  it('should display HomeView when selected view is home', () => {
    store.dispatch(appSlice.actions.setView({ selected: 'home', visible: true }))
    const { container } = render(ViewContainer)
    expect(container.innerHTML).toContain('Recent Activity') // HomeView content
  })

  it('should display CameraView when selected view is camera', async () => {
    store.dispatch(appSlice.actions.setView({ selected: 'camera', visible: true }))
    const { container } = render(ViewContainer)
    await waitFor(() => {
      const video = container.querySelector('video')
      expect(video).toBeInTheDocument()
      expect(video).toHaveAttribute('autoplay')
    })
  })

  it('should display LibraryView when selected view is library', async () => {
    store.dispatch(appSlice.actions.setView({ selected: 'library', visible: true }))
    const { container } = render(ViewContainer)
    const ul = container.querySelector('ul')
    expect(ul).toBeInTheDocument()
  })

  it('should not render any view if visible is false', () => {
    store.dispatch(appSlice.actions.setView({ selected: 'home', visible: false }))
    const { container } = render(ViewContainer)
    const view = container.querySelector('#view')
    expect(view?.children.length).toBe(0) // no visible children rendered
  })
})
