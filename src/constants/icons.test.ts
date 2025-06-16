import { describe, it, expect } from 'vitest'
import { icons } from './icons'

describe('icons', () => {
  it('should have empty path for the empty string key', () => {
    expect(icons[''].path).toBe('')
  })

  it('should have at least one icon with a non-empty path', () => {
    const nonEmptyPaths = Object.values(icons).filter((icon) => icon.path && icon.path.length > 0)
    expect(nonEmptyPaths.length).toBeGreaterThan(0)
  })

  it('should have paths for the non-empty string keys', () => {
    for (const [key, icon] of Object.entries(icons)) {
      if (key !== '') {
        expect(icon.path).not.toBe('')
      }
    }
  })
})
