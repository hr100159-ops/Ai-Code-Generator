// Vexora AI Design Tokens
// All colours, spacing, typography in one place

export const C = {
  bg:         '#0e1117',
  bg2:        '#141820',
  bg3:        '#1a2030',
  bg4:        '#1f2738',
  bg5:        '#252d42',

  border:     'rgba(255,255,255,0.06)',
  border2:    'rgba(255,255,255,0.10)',
  border3:    'rgba(255,255,255,0.18)',

  text:       '#e8eaf0',
  text2:      '#8b9bb8',
  text3:      '#5a6880',
  text4:      '#3a4660',

  accent:     '#3b8beb',
  accentDim:  'rgba(59,139,235,0.14)',

  green:      '#3ecf8e',
  greenDim:   'rgba(62,207,142,0.11)',
  amber:      '#f0a040',
  amberDim:   'rgba(240,160,64,0.11)',
  red:        '#e05555',
  redDim:     'rgba(224,85,85,0.11)',
  purple:     '#9b7fe8',
  purpleDim:  'rgba(155,127,232,0.11)',
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

// Shorthand style helpers
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
