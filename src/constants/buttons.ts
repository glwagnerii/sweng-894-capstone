import { type IconName } from './icons'
import { type RootState } from '../store'

type BooleanState = (state: RootState) => boolean

export type ButtonType = { title: string, key: string, icon: IconName, visible?: BooleanState, active?: BooleanState }
function tButton<V extends ButtonType, T extends { [key in string]: V }>(o: T): T { return o }
export const buttons = tButton({
  classificam:     { title: 'Go to PSU site',     key: '', icon: 'classifi-cam' },
  getOS:           { title: 'Get OS information', key: '', icon: 'bi-cpu' },
  notification:    { title: 'Notification',       key: '', icon: 'bi-bell' },
  openFolder:      { title: 'Open folder',        key: '', icon: 'bi-folder2-open' },
  showMenu:        { title: 'Show the menu',      key: '', icon: 'bi-list' },
  themeDark:       { title: 'Set theme to dark',  key: '', icon: 'bi-moon', visible: (s) => !s.app.theme.isDark },
  themeLight:      { title: 'Set theme to light', key: '', icon: 'bi-sun',  visible: (s) => s.app.theme.isDark },
  viewCamera:      { title: 'Open camera',        key: '', icon: 'bi-camera',               active: (s) => s.app.view.selected === 'camera' },
  viewHome:        { title: 'Goto home screen',   key: '', icon: 'bi-house',                active: (s) => s.app.view.selected === 'home' },
  viewHttp:        { title: 'Call REST api',      key: '', icon: 'bi-globe',                active: (s) => s.app.view.selected === 'http' },
  viewLibrary:     { title: 'Show photo library', key: '', icon: 'bi-collection',           active: (s) => s.app.view.selected === 'library' },
  viewPath:        { title: 'Show app paths',     key: '', icon: 'bi-terminal',             active: (s) => s.app.view.selected === 'path' },
  viewRecipe:      { title: 'Show recipe',        key: '', icon: 'bi-list-columns-reverse', active: (s) => s.app.view.selected === 'recipe' },
  viewResult:      { title: 'Open image',         key: '', icon: 'bi-image',                active: (s) => s.app.view.selected === 'result' },
})
export type ButtonName = keyof typeof buttons
