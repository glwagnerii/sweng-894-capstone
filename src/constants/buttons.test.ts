import { describe, it, expect } from 'vitest'
import { buttons } from './'
import { type App } from '../store'
import { type ViewName } from '../views'

// Mock RootState for visible/active tests

const mockState = (isDark: boolean, selected: ViewName): { app: App } => ({
  app: {
    titleBar: { title: 'Mock Title', visible: true },
    theme: { name: isDark ? 'dark' : 'light', isDark },
    view: { selected, visible: true },
  },
})

describe('buttons', () => {
  it('should have non-empty key for all buttons', () => {
    for (const [key] of Object.entries(buttons)) {
      expect(key).not.toBe('')
    }
  })

  it('should have title, icon, and key properties for all buttons', () => {
    for (const btn of Object.values(buttons)) {
      expect(typeof btn.title).toBe('string')
      expect(typeof btn.icon).toBe('string')
      expect(typeof btn.key).toBe('string')
    }
  })

  it('themeDark visible should be true when isDark is false', () => {
    const btn = buttons.themeDark
    expect(btn.visible?.(mockState(false, 'home'))).toBe(true)
    expect(btn.visible?.(mockState(true, 'home'))).toBe(false)
  })

  it('themeLight visible should be true when isDark is true', () => {
    const btn = buttons.themeLight
    expect(btn.visible?.(mockState(true, 'home'))).toBe(true)
    expect(btn.visible?.(mockState(false, 'home'))).toBe(false)
  })

  it('active property should work for view buttons', () => {
    expect(buttons.viewCamera.active?.(mockState(false, 'camera'))).toBe(true)
    expect(buttons.viewHome.active?.(mockState(false, 'home'))).toBe(true)
    expect(buttons.viewHttp.active?.(mockState(false, 'http'))).toBe(true)
    expect(buttons.viewLibrary.active?.(mockState(false, 'library'))).toBe(true)
    expect(buttons.viewPath.active?.(mockState(false, 'path'))).toBe(true)
    expect(buttons.viewRecipe.active?.(mockState(false, 'recipe'))).toBe(true)
    expect(buttons.viewResult.active?.(mockState(false, 'result'))).toBe(true)

    expect(buttons.viewCamera.active?.(mockState(false, 'home'))).toBe(false)
    expect(buttons.viewHome.active?.(mockState(false, 'result'))).toBe(false)
    expect(buttons.viewHttp.active?.(mockState(false, 'home'))).toBe(false)
    expect(buttons.viewLibrary.active?.(mockState(false, 'home'))).toBe(false)
    expect(buttons.viewPath.active?.(mockState(false, 'home'))).toBe(false)
    expect(buttons.viewRecipe.active?.(mockState(false, 'home'))).toBe(false)
    expect(buttons.viewResult.active?.(mockState(false, 'home'))).toBe(false)
  })
})
