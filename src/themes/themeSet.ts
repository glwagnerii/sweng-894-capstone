import { store } from '../store'

export function setThemeByTime() {
  const stored = getStoredTheme()
  if (stored) {
    setTheme(stored)
    return
  }

  const hour = new Date().getHours()
  const theme = (hour >= 7 && hour <= 17) ? 'light' : 'dark'
  setTheme(theme)
}

export function setTheme(theme: 'light' | 'dark') {
  document.documentElement.parentElement?.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
  store.dispatch({
    type: 'app/themeSet',
    payload: { isDark: theme === 'dark' }
  })
  console.log('Setting theme to:', theme)
  console.log('Redux state:', store.getState().app.theme)
}

export function getStoredTheme(): 'light' | 'dark' | null {
  return localStorage.getItem('theme') as 'light' | 'dark' | null
}
