// Vexora AI Design Tokens — Bank Alfalah Theme
// White + Red + Dark Grey

export const C = {
  bg:         '#ffffff',
  bg2:        '#f8f8f8',
  bg3:        '#f0f0f0',
  bg4:        '#e8e8e8',
  bg5:        '#dedede',

  border:     'rgba(0,0,0,0.08)',
  border2:    'rgba(0,0,0,0.13)',
  border3:    'rgba(0,0,0,0.22)',

  text:       '#1a1a1a',
  text2:      '#444444',
  text3:      '#888888',
  text4:      '#bbbbbb',

  accent:     '#cc0000',
  accentDim:  'rgba(204,0,0,0.08)',

  green:      '#1a7a4a',
  greenDim:   'rgba(26,122,74,0.09)',
  amber:      '#b06800',
  amberDim:   'rgba(176,104,0,0.09)',
  red:        '#cc0000',
  redDim:     'rgba(204,0,0,0.08)',
  purple:     '#5a3ea0',
  purpleDim:  'rgba(90,62,160,0.09)',
}

export const F = {
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  ui:   "'IBM Plex Sans', system-ui, sans-serif",
}

export const R = {
  sm: 4,
  md: 6,
  lg: 10,
  xl: 14,
}

export const px = n => typeof n === 'number' ? `${n}px` : n

export const card = {
  background: C.bg2,
  border: `1px solid ${C.border}`,
  borderRadius: R.lg,
}

export const monoText = {
  fontFamily: F.mono,
  fontSize: 12.5,
  lineHeight: 1.65,
}
