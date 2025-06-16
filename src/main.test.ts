import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

// Mock the Svelte mount function
vi.mock('svelte', () => ({
  mount: vi.fn(() => ({ destroy: vi.fn() })),
}))

import App from './App.svelte'
import './app.css'

describe('test main.ts', () => {
  let target: HTMLElement

  beforeEach(() => {
    target = document.createElement('div')
    target.id = 'app'
    document.body.appendChild(target)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('mounts the App component to #app', async () => {
    const { mount } = await import('svelte')
    const main = await import('./main')
    expect(mount).toHaveBeenCalledWith(App, { target: target })
    expect(main.default).toBeDefined()
  })
})
