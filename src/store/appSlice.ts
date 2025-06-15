import { createSlice } from '@reduxjs/toolkit'
import { type ViewName } from '../views'

export interface App {
  titleBar: { title: string, visible: boolean }
  view:     { selected: ViewName, visible: boolean }
  theme:    { name: string, isDark: boolean }
}

export const detectPlatform = () => {
  const ua = navigator.userAgent.toLowerCase()
  console.log(ua)
  if (/iphone|ipad|ipod/.test(ua)) return 'ios'
  if (/android/.test(ua)) return 'android'
  if (/mac/.test(ua)) return 'macos'
  if (/win/.test(ua)) return 'windows'
  if (/linux/.test(ua)) return 'linux'
  return 'desktop'
}

const app: App = {
  titleBar: { title: 'Classifi-Cam', visible: true },
  view:     { selected:'home', visible:true },
  theme:    {
    name: detectPlatform(),
    // isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    isDark: true,
  },
}

export const appSlice = createSlice({
  name: 'app',
  initialState: app,
  reducers: {
    showMenu:    (state) => { state.view.selected = 'home' },
    themeDark:   (state) => { state.theme.isDark = true },
    themeLight:  (state) => { state.theme.isDark = false },
    viewCamera:  (state) => { state.view.selected = 'camera' },
    viewHome:    (state) => { state.view.selected = 'home' },
    viewHttp:    (state) => { state.view.selected = 'http' },
    viewLibrary: (state) => { state.view.selected = 'library' },
    viewPath:    (state) => { state.view.selected = 'path' },
    viewRecipe:  (state) => { state.view.selected = 'recipe' },
    viewResult:  (state) => { state.view.selected = 'result' },
  },
})
