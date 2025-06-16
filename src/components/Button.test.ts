import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import '@testing-library/jest-dom/vitest'

import Button from './Button.svelte'
import * as store from '../store'
import { createRawSnippet } from 'svelte'

// Mock store dependencies
vi.mock('../store', () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}))

describe('Button Component', () => {
  const mockDispatch = vi.fn()

  beforeEach(() => {
    vi.mocked(store.useDispatch).mockReturnValue(mockDispatch)
    vi.mocked(store.useSelector).mockReturnValue({
      subscribe: (run: (value: boolean) => void) => {
        run(true)
        return () => {}
      },
    }) // default visible
  })

  it('renders button when visible', () => {
    const { getByTitle } = render(Button, {
      props: {
        name: 'showMenu',
        title: 'Show Menu Button',
      },
    })

    const button = getByTitle('Show Menu Button')
    expect(button).toBeInTheDocument()
  })

  it('handles default onClick behavior', async () => {
    const { getByTitle } = render(Button, {
      props: {
        name: 'showMenu',
        title: 'Show Menu Button',
      },
    })

    const button = getByTitle('Show Menu Button')
    await fireEvent.click(button)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'app/showMenu' })
  })

  it('handles custom onClick', async () => {
    const customOnClick = vi.fn()
    const { getByTitle } = render(Button, {
      props: {
        name: 'showMenu',
        title: 'Show Menu Button',
        onClick: customOnClick,
      },
    })

    const button = getByTitle('Show Menu Button')
    await fireEvent.click(button)

    expect(customOnClick).toHaveBeenCalledWith('showMenu')
  })

  it('disables button when disabled prop is true', () => {
    const { getByTitle } = render(Button, {
      props: {
        name: 'showMenu',
        title: 'Show Menu Button',
        disabled: true,
      },
    })

    const button = getByTitle('Show Menu Button')
    expect(button).toBeDisabled()
  })

  it('applies correct classes when labelRight is true', () => {
    const { getByTitle } = render(Button, {
      props: {
        name: 'showMenu',
        title: 'Show Menu Button',
        labelRight: true,
        children: createRawSnippet(() => ({ render: () => 'Camera' })),
      },
    })

    const button = getByTitle('Show Menu Button')
    const label = button.querySelector('span')
    expect(button).toHaveClass('flex-row')
    expect(label).toHaveClass('text-base')
  })

  it('applies correct classes when labelRight is false (default)', () => {
    const { getByTitle } = render(Button, {
      props: {
        name: 'showMenu',
        title: 'Show Menu Button',
        children: createRawSnippet(() => ({ render: () => 'Camera' })),
      },
    })

    const button = getByTitle('Show Menu Button')
    const label = button.querySelector('span')
    expect(button).toHaveClass('flex-col')
    expect(label).toHaveClass('text-xs')
  })
})
