import React, { useState, useRef, useEffect } from 'react'
import { Send, Trash2 } from 'lucide-react'
import { C, F, R } from '../lib/tokens'
import { LoadingDots } from './UI'

export default function ChatTab({ messages, loading, onSend, onClear }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const send = () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    onSend(text)
  }

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 68px)', gap: 0 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: C.text, letterSpacing: '-0.01em' }}>Chat</h1>
          <p style={{ fontSize: 13, color: C.text3, marginTop: 3 }}>Quick T24/jBASE questions — uses Haiku for fast responses</p>
        </div>
        <button onClick={onClear} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.text4, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontFamily: F.ui, padding: '5px 8px', borderRadius: R.md, transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = C.red} onMouseLeave={e => e.currentTarget.style.color = C.text4}>
          <Trash2 size={13} /> Clear
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? `${R.lg}px ${R.lg}px 4px ${R.lg}px` : `${R.lg}px ${R.lg}px ${R.lg}px 4px`,
              background: msg.role === 'user' ? C.accent : C.bg2,
              border: msg.role === 'user' ? 'none' : `1px solid ${C.border}`,
              color: msg.role === 'user' ? '#fff' : C.text,
              fontSize: 13.5, lineHeight: 1.7,
              fontFamily: msg.content.includes('\n    ') || msg.content.includes('SUBROUTINE') || msg.content.includes('CALL ') ? F.mono : F.ui,
              whiteSpace: 'pre-wrap',
              animation: 'fadeIn 0.2s ease',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '12px 16px', background: C.bg2, border: `1px solid ${C.border}`, borderRadius: `${R.lg}px ${R.lg}px ${R.lg}px 4px` }}>
              <LoadingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ flexShrink: 0, display: 'flex', gap: 10, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about T24 modules, jBASE errors, or any banking tech question... (Enter to send)"
          rows={2}
          style={{
            flex: 1, fontFamily: F.ui, fontSize: 13.5, lineHeight: 1.6,
            background: C.bg2, border: `1px solid ${C.border2}`, borderRadius: R.lg,
            color: C.text, padding: '10px 14px', outline: 'none', resize: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = C.border3}
          onBlur={e => e.target.style.borderColor = C.border2}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            width: 42, height: 42, borderRadius: R.md, flexShrink: 0, alignSelf: 'flex-end',
            background: loading || !input.trim() ? C.bg3 : C.accent,
            border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}
        >
          <Send size={16} color={loading || !input.trim() ? C.text4 : '#fff'} />
        </button>
      </div>

    </div>
  )
}
