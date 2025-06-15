import { describe, it, expect, afterEach } from 'vitest'
import { store, useDispatch } from './'
import { detectPlatform } from './appSlice'

describe('dispatch actions change states', () => {
  const dispatch = useDispatch()
  it('showMenu sets view.selected to home', () => {
    dispatch({ type: 'app/themeLight' })
    dispatch({ type: 'app/themeDark' })
    expect(store.getState().app.theme.isDark).toBe(true)
  })

  it('showMenu sets view.selected to home', () => {
    dispatch({ type: 'app/themeDark' })
    dispatch({ type: 'app/themeLight' })
    expect(store.getState().app.theme.isDark).toBe(false)
  })

  it('showMenu sets view.selected to home', () => {
    dispatch({ type: 'app/viewCamera' })
    dispatch({ type: 'app/showMenu' })
    expect(store.getState().app.view.selected).toBe('home')
  })

  it('viewCamera sets view.selected to camera', () => {
    dispatch({ type: 'app/viewHome' })
    dispatch({ type: 'app/viewCamera' })
    expect(store.getState().app.view.selected).toBe('camera')
  })

  it('viewHome sets view.selected to home', () => {
    dispatch({ type: 'app/viewCamera' })
    dispatch({ type: 'app/viewHome' })
    expect(store.getState().app.view.selected).toBe('home')
  })

  it('viewHttp sets view.selected to http', () => {
    dispatch({ type: 'app/viewCamera' })
    dispatch({ type: 'app/viewHttp' })
    expect(store.getState().app.view.selected).toBe('http')
  })

  it('viewLibrary sets view.selected to library', () => {
    dispatch({ type: 'app/viewCamera' })
    dispatch({ type: 'app/viewLibrary' })
    expect(store.getState().app.view.selected).toBe('library')
  })
  it('viewPath sets view.selected to path', () => {
    dispatch({ type: 'app/viewCamera' })
    dispatch({ type: 'app/viewPath' })
    expect(store.getState().app.view.selected).toBe('path')
  })
  it('viewRecipe sets view.selected to recipe', () => {
    dispatch({ type: 'app/viewCamera' })
    dispatch({ type: 'app/viewRecipe' })
    expect(store.getState().app.view.selected).toBe('recipe')
  })
  it('viewResult sets view.selected to result', () => {
    dispatch({ type: 'app/viewCamera' })
    dispatch({ type: 'app/viewResult' })
    expect(store.getState().app.view.selected).toBe('result')
  })
})

describe('detectPlatform', () => {
  const originalUserAgent = navigator.userAgent

  function setUserAgent(ua: string) {
    Object.defineProperty(navigator, 'userAgent', { value: ua, configurable: true })
  }

  afterEach(() => { setUserAgent(originalUserAgent) })

  it('detects iOS', () => {
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)')
    expect(detectPlatform()).toBe('ios')
  })

  it('detects Android', () => {
    setUserAgent('Mozilla/5.0 (Linux; Android 10; SM-G970F)')
    expect(detectPlatform()).toBe('android')
  })

  it('detects macOS', () => {
    setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
    expect(detectPlatform()).toBe('macos')
  })

  it('detects Windows', () => {
    setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
    expect(detectPlatform()).toBe('windows')
  })

  it('detects Linux', () => {
    setUserAgent('Mozilla/5.0 (X11; Linux x86_64)')
    expect(detectPlatform()).toBe('linux')
  })

  it('returns desktop for unknown user agent', () => {
    setUserAgent('UnknownAgent/1.0')
    expect(detectPlatform()).toBe('desktop')
  })
})
