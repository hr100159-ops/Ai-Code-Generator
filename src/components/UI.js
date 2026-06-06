import React, { useState, useEffect } from 'react'
import { C, F, R } from '../lib/tokens'

// ── BTN ─────────────────────────────────────────────────
export function Btn({ children, variant = 'default', size = 'md', onClick, disabled, style = {} }) {
  const [hover, setHover] = useState(false)
  const sizes = { sm: { padding: '5px 11px', fontSize: 12 }, md: { padding: '7px 14px', fontSize: 13 }, lg: { padding: '10px 22px', fontSize: 14, fontWeight: 500 } }
  const variants = {
    default: { bg: hover ? C.bg5 : C.bg3, border: C.border3, color: hover ? C.text : C.text2 },
    primary: { bg: hover ? '#4a99f8' : C.accent, border: hover ? '#4a99f8' : C.accent, color: '#fff' },
    ghost:   { bg: 'transparent', border: 'transparent', color: hover ? C.text2 : C.text3 },
    danger:  { bg: C.redDim, border: 'rgba(224,85,85,0.25)', color: C.red },
  }
  const v = variants[variant] || variants.default
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        borderRadius: R.md, border: `1px solid ${v.border}`,
        background: v.bg, color: v.color,
        fontFamily: F.ui, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, transition: 'all 0.15s',
        whiteSpace: 'nowrap', ...sizes[size], ...style,
      }}
    >
      {children}
    </button>
  )
}

// ── BADGE ────────────────────────────────────────────────
export function Badge({ children, color = 'blue' }) {
  const map = {
    blue:   [C.accentDim,  'rgba(59,139,235,0.25)',  C.accent],
    green:  [C.greenDim,   'rgba(62,207,142,0.25)',  C.green],
    amber:  [C.amberDim,   'rgba(240,160,64,0.25)',  C.amber],
    red:    [C.redDim,     'rgba(224,85,85,0.25)',   C.red],
    purple: [C.purpleDim,  'rgba(155,127,232,0.25)', C.purple],
  }
  const [bg, border, text] = map[color] || map.blue
  return (
    <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 500, padding: '2px 7px', borderRadius: R.sm, background: bg, border: `1px solid ${border}`, color: text }}>
      {children}
    </span>
  )
}

// ── CHIP GROUP ───────────────────────────────────────────
export function ChipGroup({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(opt => {
        const active = value === opt.value
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)} style={{
            padding: '4px 12px', borderRadius: 100,
            border: `1px solid ${active ? 'rgba(59,139,235,0.4)' : C.border2}`,
            background: active ? C.accentDim : C.bg2,
            color: active ? C.accent : C.text3,
            fontFamily: F.mono, fontSize: 11, cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

// ── SECTION (collapsible) ────────────────────────────────
export function Section({ title, icon, iconColor, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  const [hover, setHover] = useState(false)
  const colorMap = {
    blue:   [C.accentDim, C.accent], green: [C.greenDim, C.green],
    amber:  [C.amberDim,  C.amber],  red:   [C.redDim,   C.red],
    purple: [C.purpleDim, C.purple],
  }
  const [bg, color] = colorMap[iconColor] || colorMap.blue
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 20px', background: hover ? C.bg3 : 'transparent',
          border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
        }}
      >
        <div style={{ width: 22, height: 22, borderRadius: R.sm, display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, color, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
          {icon}
        </div>
        <span style={{ flex: 1, fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: C.text2 }}>
          {title}
        </span>
        <span style={{ color: C.text4, fontSize: 12, display: 'inline-block', transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>›</span>
      </button>
      {open && <div style={{ padding: '0 20px 20px' }}>{children}</div>}
    </div>
  )
}

// ── CODE BLOCK ───────────────────────────────────────────
export function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  return (
    <div style={{ position: 'relative', marginTop: 8 }}>
      <button onClick={copy} style={{
        position: 'absolute', top: 10, right: 10, zIndex: 1,
        padding: '3px 9px', fontSize: 11, fontFamily: F.ui,
        background: C.bg3, border: `1px solid ${C.border2}`,
        borderRadius: R.sm, color: C.text3, cursor: 'pointer',
      }}>
        {copied ? '✓ copied' : 'copy'}
      </button>
      <pre style={{
        background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: R.lg,
        padding: '18px 20px', overflowX: 'auto', fontFamily: F.mono,
        fontSize: 12.5, lineHeight: 1.65, color: '#1a1a1a', whiteSpace: 'pre', tabSize: 4, margin: 0,
      }}>
        {code}
      </pre>
    </div>
  )
}

// ── CHANGE ITEM ──────────────────────────────────────────
export function ChangeItem({ type, text }) {
  const map = {
    FIX:  [C.redDim,    'rgba(224,85,85,0.2)',   C.red],
    PERF: [C.greenDim,  'rgba(62,207,142,0.2)',  C.green],
    INFO: [C.accentDim, 'rgba(59,139,235,0.2)',  C.accent],
    WARN: [C.amberDim,  'rgba(240,160,64,0.2)',  C.amber],
  }
  const [bg, border, color] = map[type] || map.INFO
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 12px', borderRadius: R.md, background: C.bg, border: `1px solid ${C.border}`, fontSize: 12.5, lineHeight: 1.6 }}>
      <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 500, padding: '2px 7px', borderRadius: R.sm, flexShrink: 0, marginTop: 1, background: bg, border: `1px solid ${border}`, color }}>
        {type}
      </span>
      <span style={{ color: C.text2 }}>{text}</span>
    </div>
  )
}

// ── FIELD GROUP ──────────────────────────────────────────
export function FieldGroup({ label, children, style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      <label style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: C.text3 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

// ── CHECKBOX ─────────────────────────────────────────────
export function Checkbox({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: C.text2, cursor: 'pointer', userSelect: 'none' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ width: 14, height: 14, accentColor: C.accent, cursor: 'pointer' }} />
      {label}
    </label>
  )
}

// ── TOAST ────────────────────────────────────────────────
let _showToast = null

export function useToast() {
  return { show: (msg, type = '') => _showToast?.({ msg, type }) }
}

export function ToastProvider() {
  const [toast, setToast] = useState(null)
  _showToast = setToast
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])
  if (!toast) return null
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      background: C.bg4, border: `1px solid ${toast.type === 'success' ? 'rgba(62,207,142,0.4)' : C.border2}`,
      borderRadius: R.md, padding: '10px 16px', fontSize: 13,
      color: toast.type === 'success' ? C.green : C.text,
      zIndex: 9999, pointerEvents: 'none',
      animation: 'fadeIn 0.2s ease',
    }}>
      {toast.msg}
    </div>
  )
}

// ── LOADING DOTS ─────────────────────────────────────────
export function LoadingDots({ color = C.accent }) {
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </span>
  )
}

// ── DIVIDER ──────────────────────────────────────────────
export function Divider() {
  return <div style={{ height: 1, background: C.border, margin: '4px 0' }} />
}
