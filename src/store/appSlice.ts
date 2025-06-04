import { createSlice } from '@reduxjs/toolkit'

interface Panel { visible: boolean, size: number, cssVar: string }
import { ZOOM_MIN, ZOOM_MAX, type PanelNames, type LeftPanelName, type RightPanelName, type BottomPanelName } from '../constants'

interface BottomPanel extends Panel { selected: BottomPanelName }
interface LeftPanel extends Panel { selected: LeftPanelName }
interface RightPanel extends Panel { selected: RightPanelName }

export interface App {
  titleBar: { title: string, visible: boolean }
  panels: { left: LeftPanel, right: RightPanel, bottom: BottomPanel }
  theme: { name: string, isDark: boolean }
  zoom: { level: number, fit: boolean, big: boolean, height: number, width: number }
}

const detectPlatform = () => {
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
  titleBar: { title: 'Classi-Cam', visible: true },
  panels: {
    left:   { visible: false, size: 200, cssVar: '--w-panel-left',   selected: 'left1' },
    right:  { visible: false, size: 200, cssVar: '--w-panel-right',  selected: 'right' },
    bottom: { visible: false, size: 100, cssVar: '--h-panel-bottom', selected: 'bottom' },
  },
  theme: {
    name: detectPlatform(),
    isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
  },
  zoom: { level: 70, fit: false, big: true, height: 900, width: 1600 },
}

const toggleLeftPanel = (state: App, selected: LeftPanelName) => {
  const showLeft = (state.panels['left'].selected !== selected) || !state.panels['left'].visible
  togglePanelVisibility(state, 'left', showLeft)
  state.panels['left'].selected = selected
}

const togglePanelVisibility = (state: App, panel: PanelNames, show: boolean) => {
  const size = `${show ? state.panels[panel].size : 0}px`
  state.panels[panel].visible = show
  const r = document.querySelector(':root') as HTMLElement
  if (r) r.style.setProperty(state.panels[panel].cssVar, size)
}

const zoomToggleAspectSize = (state: App) => {
  state.zoom.big = !state.zoom.big
  state.zoom.height = state.zoom.big ? 960 : 768
  state.zoom.width = state.zoom.big ? 1280 : 1024
  if (state.zoom.fit) zoomFit(state)
}

const zoomFit = (state: App) => {
  const div = document.getElementById('main-body')
  if (div) { state.zoom.level = Math.min(Math.floor((div.offsetWidth - 48) * 100 / state.zoom.width), Math.floor((div.offsetHeight - 48) * 100 / state.zoom.height)) }
}

export const appSlice = createSlice({
  name: 'app',
  initialState: app,
  reducers: {
    panelBottomHide: (state) => { togglePanelVisibility(state, 'bottom', false) },
    panelBottomShow: (state) => { togglePanelVisibility(state, 'bottom', true) },
    panelLeftHide:   (state) => { togglePanelVisibility(state, 'left', false) },
    panelLeftShow:   (state) => { togglePanelVisibility(state, 'left', true) },
    panelRightHide:  (state) => { togglePanelVisibility(state, 'right', false) },
    panelRightShow:  (state) => { togglePanelVisibility(state, 'right', true) },

    showLeft1:       (state) => { toggleLeftPanel(state, 'left1') },
    showLeft2:       (state) => { toggleLeftPanel(state, 'left2') },

    themeDark:       (state) => { state.theme.isDark = true },
    themeLight:      (state) => { state.theme.isDark = false },

    windowResize:    (state) => { if (state.zoom.fit) zoomFit(state) },
    zoomAspect:      (state) => { zoomToggleAspectSize(state) },
    zoomDecrease:    (state) => { state.zoom.level = Math.max(Math.ceil(state.zoom.level / 10 - 1) * 10, ZOOM_MIN); state.zoom.fit = false },
    zoomFit:         (state) => { if (!state.zoom.fit) { zoomFit(state) } state.zoom.fit = !state.zoom.fit },
    zoomIncrease:    (state) => { state.zoom.level = Math.min(Math.floor(state.zoom.level / 10 + 1) * 10, ZOOM_MAX); state.zoom.fit = false },
    zoomReset:       (state) => { state.zoom.level = 100; state.zoom.fit = false },
    zoomSlide:       (state, action) => { state.zoom.level = action.payload; state.zoom.fit = false },
  },
})
