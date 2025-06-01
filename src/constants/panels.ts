export type PanelType = { min: number, max: number }

function tPanel<V extends PanelType, T extends { [key in string]: V }>(o: T): T { return o } // ensure type of value object
export const leftPanels = tPanel({
  left1: { min: 100, max: 400 },
  left2: { min: 100, max: 400 },
})
export type LeftPanelName = keyof typeof leftPanels

export const rightPanels = tPanel({
  right: { min: 100, max: 300 },
})
export type RightPanelName = keyof typeof rightPanels

export const bottomPanels = tPanel({
  bottom: { min: 100, max: 500 },
})

export type BottomPanelName = keyof typeof bottomPanels
export type PanelName = LeftPanelName | RightPanelName | BottomPanelName
export type PanelNames = 'left' | 'right' | 'bottom'
