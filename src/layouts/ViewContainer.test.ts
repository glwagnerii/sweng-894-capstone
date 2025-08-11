import { vi } from 'vitest'
import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/svelte'
import { writable } from 'svelte/store'
import '@testing-library/jest-dom/vitest'
import ViewContainer from './ViewContainer.svelte'

import { useDispatch, useSelector } from '../store'
import { views } from '../views'

vi.mock('../store', () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}))

describe('ViewContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSelector).mockReset()
    vi.mocked(useDispatch).mockReturnValue(vi.fn())
  })

  Object.keys(views).forEach((view) => {
    if (view === 'details' || view === 'settings') return  // these need more detailed tests
    it(`renders correctly for view "${view}"`, () => {
      vi.mocked(useSelector)
        .mockReturnValueOnce(writable(view))
        .mockReturnValueOnce(writable(true))

      const { container } = render(ViewContainer)
      const viewDiv = container.querySelector(`#view-${view}`)
      expect(viewDiv).toBeInTheDocument()
    })
  })
})
