import React, { useState, useEffect } from 'react'
import { BookOpen, Plus, CheckSquare, MessageSquare, Activity } from 'lucide-react'
import { C, F, R } from '../lib/tokens'
import { getHealth } from '../lib/api'

const NAV = [
  { id: 'kb',  label: 'Knowledge Base', Icon: BookOpen   },
  { id: 'req', label: 'Requirements',   Icon: Plus        },
  { id: 'out', label: 'Output',         Icon: CheckSquare },
  { id: 'chat',label: 'Chat',           Icon: MessageSquare },
]

export default function Sidebar({ activeTab, onTabChange, kbCount, hasOutput }) {
  const [health, setHealth] = useState(null)
  const [navHover, setNavHover] = useState(null)

  useEffect(() => {
    getHealth().then(setHealth).catch(() => {})
    const t = setInterval(() => getHealth().then(setHealth).catch(() => {}), 30000)
    return () => clearInterval(t)
  }, [])

  const providerLabel = health?.provider === 'ollama'
    ? `ollama / ${health.ollama?.model || 'unknown'}`
    : 'claude'

  const providerOnline = health?.provider === 'ollama'
    ? health.ollama?.online
    : health?.claude?.configured

  return (
    <aside style={{ width: 220, flexShrink: 0, background: '#ffffff', borderRight: '1px solid #e8e8e8', borderTop: '3px solid #cc0000', display: 'flex', flexDirection: 'column' }}>

      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 16px 18px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ color: C.accent, flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="1" y="1" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="12" y="1" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" opacity=".4"/>
            <rect x="1" y="12" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" opacity=".4"/>
            <rect x="12" y="12" width="9" height="9" rx="1.5" fill="currentColor" opacity=".9"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.text, lineHeight: 1.3 }}>T24 Code Studio</div>
          <div style={{ fontSize: 10, color: C.text3, letterSpacing: '0.04em', marginTop: 1 }}> AI · R22</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 8px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ id, label, Icon }) => {
          const active = activeTab === id
          const hover = navHover === id && !active
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              onMouseEnter={() => setNavHover(id)}
              onMouseLeave={() => setNavHover(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: R.md,
                border: active ? '1px solid rgba(59,139,235,0.2)' : '1px solid transparent',
                background: active ? C.accentDim : hover ? C.bg3 : 'transparent',
                color: active ? C.accent : hover ? C.text2 : C.text3,
                fontFamily: F.ui, fontSize: 13, cursor: 'pointer',
                width: '100%', textAlign: 'left', transition: 'all 0.15s',
              }}
            >
              <Icon size={15} style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }} />
              <span style={{ flex: 1 }}>{label}</span>
              {id === 'kb' && kbCount > 0 && (
                <span style={{ background: active ? 'rgba(59,139,235,0.2)' : C.bg4, color: active ? C.accent : C.text4, fontFamily: F.mono, fontSize: 10, padding: '1px 6px', borderRadius: 10 }}>
                  {kbCount}
                </span>
              )}
              {id === 'out' && hasOutput && (
                <span style={{ width: 6, height: 6, background: C.green, borderRadius: '50%' }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Provider status */}
      <div style={{ padding: '12px 16px 16px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Activity size={12} color={providerOnline ? C.green : C.red} />
          <span style={{ fontFamily: F.mono, fontSize: 10, color: providerOnline ? C.green : C.red }}>
            {health ? providerLabel : 'connecting...'}
          </span>
        </div>
        <div style={{ fontSize: 11, color: C.text3 }}>
          {kbCount} doc{kbCount !== 1 ? 's' : ''} in KB
        </div>
      </div>

    </aside>
  )
}
