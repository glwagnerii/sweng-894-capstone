import { type IconName } from './icons'
import { type RootState } from '../store'

type Visible = (state: RootState) => boolean

export type ButtonType = { title: string, key: string, icon: IconName, visible?: Visible, active?: Visible }
function tButton<V extends ButtonType, T extends { [key in string]: V }>(o: T): T { return o }
export const buttons = tButton({
  getOS:           { title: 'Get OS information', key: '', icon: 'bi-cpu' },
  notification:    { title: 'Notification',       key: '', icon: 'bi-bell' },
  panelBottomHide: { title: 'Hide bottom panel',  key: '', icon: 'bi-arrow-down-square-fill',  visible: (s) => s.app.panels.bottom.visible },
  panelBottomShow: { title: 'Show bottom panel',  key: '', icon: 'bi-arrow-down-square',       visible: (s) => !s.app.panels.bottom.visible },
  panelLeftHide:   { title: 'Hide left panel',    key: '', icon: 'bi-arrow-left-square-fill',  visible: (s) => s.app.panels.left.visible },
  panelLeftShow:   { title: 'Show left panel',    key: '', icon: 'bi-arrow-left-square',       visible: (s) => !s.app.panels.left.visible },
  panelRightHide:  { title: 'Hide right panel',   key: '', icon: 'bi-arrow-right-square-fill', visible: (s) => s.app.panels.right.visible },
  panelRightShow:  { title: 'Show right panel',   key: '', icon: 'bi-arrow-right-square',      visible: (s) => !s.app.panels.right.visible },
  psu:             { title: 'Go to PSU site',     key: '', icon: 'psu' },
  showLeft1:       { title: 'Show left1 panel',   key: '', icon: 'bi-1-square',                active: (s) => s.app.panels.left.visible && (s.app.panels.left.selected === 'left1') },
  showLeft2:       { title: 'Show left1 panel',   key: '', icon: 'bi-2-square',                active: (s) => s.app.panels.left.visible && (s.app.panels.left.selected === 'left2') },
  themeDark:       { title: 'Set theme to dark',  key: '', icon: 'bi-moon',                    visible: (s) => !s.app.theme.isDark },
  themeLight:      { title: 'Set theme to light', key: '', icon: 'bi-sun',                     visible: (s) => s.app.theme.isDark },
  zoomAspect:      { title: 'Toggle aspect size', key: '', icon: 'bi-aspect-ratio',            active: (s) => s.app.zoom.big === true },
  zoomDecrease:    { title: 'Zoom out',           key: '', icon: 'bi-dash' },
  zoomFit:         { title: 'Fit to window',      key: '', icon: 'bi-arrows-fullscreen',       active: (s) => s.app.zoom.fit },
  zoomIncrease:    { title: 'Zoom in',            key: '', icon: 'bi-plus' },
  zoomReset:       { title: 'Zoom reset to 100%', key: '', icon: '' },
  zoomValue:       { title: 'Zoom level',         key: '', icon: '' },
})
export type ButtonName = keyof typeof buttons
