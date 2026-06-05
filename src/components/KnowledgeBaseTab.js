import React, { useRef, useState } from 'react'
import { Upload, Trash2, FileCode, Terminal } from 'lucide-react'
import { C, F, R } from '../lib/tokens'
import { Btn, FieldGroup, useToast } from './UI'

function fmtSize(n) { return n < 1024 ? `${n}b` : `${(n / 1024).toFixed(1)}kb` }

export default function KnowledgeBaseTab({ docs, onAddFiles, onAddDoc, onRemove, onClear, totalChars }) {
  const { show } = useToast()
  const fileRef = useRef(null)
  const [pasteName, setPasteName] = useState('')
  const [pasteContent, setPasteContent] = useState('')
  const [dragging, setDragging] = useState(false)

  const handleDrop = async (e) => { e.preventDefault(); setDragging(false); await onAddFiles(e.dataTransfer.files) }
  const handleFile = async (e) => { await onAddFiles(e.target.files); e.target.value = '' }

  const handleAddPaste = () => {
    if (!pasteContent.trim()) { show('Paste some code first'); return }
    const name = pasteName.trim() || `ROUTINE_${Date.now()}`
    onAddDoc({ name, content: pasteContent.trim(), type: 'paste' })
    setPasteName(''); setPasteContent('')
    show(`Added: ${name}`, 'success')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: C.text, letterSpacing: '-0.01em' }}>Knowledge Base</h1>
          <p style={{ fontSize: 13, color: C.text3, marginTop: 3 }}>
            Upload routines and T24 docs — persisted in browser storage
            {totalChars > 0 && <span style={{ color: C.amber, marginLeft: 8 }}>{fmtSize(totalChars)} loaded</span>}
          </p>
        </div>
        {docs.length > 0 && <Btn size="sm" onClick={onClear}>Clear All</Btn>}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `1px dashed ${dragging ? C.accent : C.border2}`,
          borderRadius: R.xl, padding: '36px 24px', textAlign: 'center',
          cursor: 'pointer', background: dragging ? 'rgba(59,139,235,0.07)' : C.bg2,
          transition: 'all 0.2s',
        }}
      >
        <input ref={fileRef} type="file" multiple accept=".txt,.b,.bas,.md,.pdf" style={{ display: 'none' }} onChange={handleFile} />
        <Upload size={28} color={C.text4} style={{ margin: '0 auto 12px' }} />
        <p style={{ fontSize: 14, color: C.text2 }}>Drop files here or <span style={{ color: C.accent, textDecoration: 'underline' }}>browse</span></p>
        <p style={{ fontSize: 11, color: C.text3, marginTop: 5, fontFamily: F.mono }}>.txt · .b · .bas · .md — jBASE routines, T24 docs, BRDs</p>
      </div>

      {/* Paste */}
      <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: R.lg, overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 11, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Paste a routine</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={pasteName} onChange={e => setPasteName(e.target.value)} placeholder="Routine name (e.g. PK.FT.CHECK)" style={{ fontFamily: F.mono, fontSize: 11, background: C.bg3, border: `1px solid ${C.border2}`, borderRadius: R.sm, color: C.text, padding: '5px 10px', width: 250, outline: 'none' }} />
            <Btn size="sm" onClick={handleAddPaste}>Add to KB</Btn>
          </div>
        </div>
        <textarea value={pasteContent} onChange={e => setPasteContent(e.target.value)} placeholder="Paste jBASE subroutine here..." style={{ width: '100%', minHeight: 150, display: 'block', fontFamily: F.mono, fontSize: 12.5, lineHeight: 1.65, background: C.bg, border: 'none', color: C.text, padding: '13px 16px', outline: 'none', resize: 'vertical' }} />
      </div>

      {/* Doc list */}
      {docs.length === 0 ? (
        <p style={{ textAlign: 'center', color: C.text4, fontSize: 13, padding: 12 }}>No documents loaded. KB persists across sessions.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {docs.map(doc => (
            <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 13px', background: C.bg2, border: `1px solid ${C.border}`, borderRadius: R.md }}>
              <div style={{ width: 28, height: 28, background: C.bg3, borderRadius: R.sm, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {doc.type === 'paste' ? <Terminal size={14} color={C.accent} /> : <FileCode size={14} color={C.accent} />}
              </div>
              <span style={{ flex: 1, fontFamily: F.mono, fontSize: 12, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={doc.name}>{doc.name}</span>
              <span style={{ fontSize: 11, color: C.text3, flexShrink: 0 }}>{fmtSize(doc.content.length)}</span>
              <button onClick={() => onRemove(doc.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.text4, padding: 4, display: 'flex', alignItems: 'center', borderRadius: R.sm, transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = C.red} onMouseLeave={e => e.currentTarget.style.color = C.text4}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
