import { vi } from 'vitest'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'
import { TitleBar } from './'
import { useDispatch } from '../store'

vi.mock('../store', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' && actual !== null ? actual : {}),
    useDispatch: vi.fn(),
  }
})

// Mock Tauri plugins
vi.mock('@tauri-apps/plugin-opener', () => ({
  openUrl: vi.fn(),
}))

vi.mock('@tauri-apps/plugin-os', () => ({
  arch: vi.fn(() => 'x64'),
  locale: vi.fn(() => Promise.resolve('en-US')),
  platform: vi.fn(() => 'darwin'),
  type: vi.fn(() => 'Darwin'),
  version: vi.fn(() => '14.0.0'),
}))

vi.mock('@tauri-apps/plugin-dialog', () => ({
  open: vi.fn(() => Promise.resolve('/path/to/file')),
  message: vi.fn(() => Promise.resolve()),
}))

// Mock hidePopover on HTMLUListElement for all tests
Object.defineProperty(HTMLUListElement.prototype, 'hidePopover', {
  value: () => {},
  writable: true,
})

describe('TitleBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    const { container } = render(TitleBar)
    expect(container).toBeInTheDocument()
  })

  it('has correct structure and CSS classes', () => {
    const { container } = render(TitleBar)
    const titleBar = container.querySelector('#titlebar')
    expect(titleBar).toBeInTheDocument()
    expect(titleBar).toHaveClass('border-b', 'flex', 'items-center', 'h-12', 'select-none', 'overflow-hidden', 'drag')
  })

  it('renders a Classifi-Cam brand button', () => {
    const { container } = render(TitleBar)
    const btn = container.querySelector('.btn-classificam')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveTextContent('Classifi-Cam')
  })

  it('renders a view Home button', () => {
    const { container } = render(TitleBar)
    const btn = container.querySelector('.btn-viewHome')
    expect(btn).toBeInTheDocument()
  })

  it('renders only 1 theme button', () => {
    const { container } = render(TitleBar)
    const btnLight = container.querySelector('.btn-themeLight')
    const btnDark = container.querySelector('.btn-themeDark')

    // Exactly one theme button should be present
    const themeButtonCount = (btnLight ? 1 : 0) + (btnDark ? 1 : 0)
    expect(themeButtonCount).toBe(1)

    // At least one should be present
    expect(btnLight || btnDark).toBeTruthy()
  })

  it('renders a view Settings button', () => {
    const { container } = render(TitleBar)
    const btn = container.querySelector('.btn-viewSettings')
    expect(btn).toBeInTheDocument()
  })

  it('renders a show Menu button', () => {
    const { container } = render(TitleBar)
    const btn = container.querySelector('.btn-showMenu')
    expect(btn).toBeInTheDocument()
  })

  it('renders a View Paths menu button', () => {
    const { container } = render(TitleBar)
    const btn = container.querySelector('.btn-viewPath')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveTextContent('View Paths')
  })

  it('renders a OS Values menu button', () => {
    const { container } = render(TitleBar)
    const btn = container.querySelector('.btn-getOS')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveTextContent('OS Values')
  })

  it('renders an Open Model menu button', () => {
    const { container } = render(TitleBar)
    const btn = container.querySelector('.btn-openFolder')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveTextContent('Open Model')
  })

  it('renders popover menu with correct structure', () => {
    const { container } = render(TitleBar)
    const popoverMenu = container.querySelector('#popover-menu')
    expect(popoverMenu).toBeInTheDocument()
    expect(popoverMenu).toHaveAttribute('popover')
  })

  it('calls openUrl when Classifi-Cam button is clicked', async () => {
    const { openUrl } = await import('@tauri-apps/plugin-opener')
    const { container } = render(TitleBar)

    const brandButton = container.querySelector('.btn-classificam')
    await fireEvent.click(brandButton!)

    expect(openUrl).toHaveBeenCalledWith('https://github.com/glwagnerii/sweng-894-capstone')
  })

  it('shows OS information when OS Values menu item is clicked', async () => {
    const { message } = await import('@tauri-apps/plugin-dialog')
    const { container } = render(TitleBar)

    const osButton = container.querySelector('.btn-getOS')
    await fireEvent.click(osButton!)

    expect(message).toHaveBeenCalledWith(
      expect.stringContaining('Platform: darwin'),
      { title: 'Classific-Cam OS Information', kind: 'info' },
    )
  })

  it('opens file dialog when Open Model menu item is clicked', async () => {
    const { open, message } = await import('@tauri-apps/plugin-dialog')
    const { container } = render(TitleBar)

    const openButton = container.querySelector('.btn-openFolder')
    await fireEvent.click(openButton!)

    expect(open).toHaveBeenCalledWith({ multiple: false, directory: false })
    expect(message).toHaveBeenCalledWith(
      'You selected: /path/to/file',
      { title: 'Classifi-Cam', kind: 'info' },
    )
  })

  it('dispatches app/viewPath when View Path menu item is clicked', async () => {
    const mockDispatch = vi.fn()
    vi.mocked(useDispatch).mockReturnValue(mockDispatch)
    const { container } = render(TitleBar)
    const viewPathButton = container.querySelector('.btn-viewPath')
    await fireEvent.click(viewPathButton!)
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'app/viewPath' })
  })

  it('has proper layout structure with correct order classes', () => {
    const { container } = render(TitleBar)

    const brandSection = container.querySelector('.order-0')
    const titleSection = container.querySelector('.order-1')
    const buttonsSection = container.querySelector('.order-2')

    expect(brandSection).toBeInTheDocument()
    expect(titleSection).toBeInTheDocument()
    expect(buttonsSection).toBeInTheDocument()

    expect(brandSection).toHaveClass('order-0')
    expect(titleSection).toHaveClass('order-1')
    expect(buttonsSection).toHaveClass('order-2')
  })

  it('does not throw when show Menu button is clicked', async () => {
    const { container } = render(TitleBar)
    const btn = container.querySelector('.btn-showMenu')
    // Should not throw or error on click
    await expect(fireEvent.click(btn!)).resolves.not.toThrow()
  })
})
