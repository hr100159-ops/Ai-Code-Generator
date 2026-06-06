// Vexora AI Design Tokens — Light Theme
// All colours, spacing, typography in one place

export const C = {
  bg:         '#f5f6fa',
  bg2:        '#ffffff',
  bg3:        '#f0f2f7',
  bg4:        '#e8ebf2',
  bg5:        '#dde1ec',

  border:     'rgba(0,0,0,0.07)',
  border2:    'rgba(0,0,0,0.11)',
  border3:    'rgba(0,0,0,0.20)',

  text:       '#1a1f2e',
  text2:      '#4a5568',
  text3:      '#8896b0',
  text4:      '#b0bcd0',

  accent:     '#2b7de9',
  accentDim:  'rgba(43,125,233,0.10)',

  green:      '#16a370',
  greenDim:   'rgba(22,163,112,0.10)',
  amber:      '#c47d0a',
  amberDim:   'rgba(196,125,10,0.10)',
  red:        '#d03232',
  redDim:     'rgba(208,50,50,0.10)',
  purple:     '#6f4ecf',
  purpleDim:  'rgba(111,78,207,0.10)',
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
