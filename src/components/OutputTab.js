import React from 'react'
import { Copy, Download } from 'lucide-react'
import { C, F, R } from '../lib/tokens'
import { Btn, Badge, Section, CodeBlock, ChangeItem, LoadingDots, useToast } from './UI'

export default function OutputTab({ result, loading, statusMsg, module: mod, mode }) {
  const { show } = useToast()

  const copyCode = () => {
    if (!result?.code) return
    navigator.clipboard.writeText(result.code)
    show('Code copied', 'success')
  }

  const downloadCode = () => {
    if (!result?.code) return
    const name = (result.routine_name || 'ROUTINE').replace(/\./g, '_') + '.b'
    const blob = new Blob([result.code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    Object.assign(document.createElement('a'), { href: url, download: name }).click()
    URL.revokeObjectURL(url)
    show(`Downloaded ${name}`, 'success')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: C.text, letterSpacing: '-0.01em' }}>Output</h1>
          <p style={{ fontSize: 13, color: C.text3, marginTop: 3, fontFamily: result?.routine_name ? F.mono : F.ui }}>
            {result?.routine_name || 'Generated code and analysis appear here'}
          </p>
        </div>
        {result?.code && (
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn size="sm" onClick={copyCode}><Copy size={12} /> Copy Code</Btn>
            <Btn size="sm" onClick={downloadCode}><Download size={12} /> Download .b</Btn>
          </div>
        )}
      </div>

      {/* Card */}
      <div style={{ flex: 1, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: R.xl, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 400 }}>

        {/* Loading */}
        {loading && (
          <div style={{ padding: '28px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <LoadingDots />
            <span style={{ fontSize: 13, color: C.text2 }}>{statusMsg || 'Processing...'}</span>
          </div>
        )}

        {/* Empty */}
        {!loading && !result && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: C.text3, fontSize: 13, padding: 40, textAlign: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="1.5" opacity=".2"/><path d="M16 18h16M16 24h12M16 30h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/></svg>
            <p>Fill in the <strong style={{ color: C.text2 }}>Requirements</strong> tab and click <strong style={{ color: C.text2 }}>Generate</strong></p>
          </div>
        )}

        {/* Results */}
        {!loading && result && (
          <>
            {/* Meta */}
            <div style={{ padding: '12px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <Badge color="blue">{mod}</Badge>
              <Badge color="green">{mode}</Badge>
              {result.changes?.length > 0 && <Badge color="amber">{result.changes.length} finding{result.changes.length > 1 ? 's' : ''}</Badge>}
              {result.similar_routines?.length > 0 && <Badge color="purple">{result.similar_routines.length} similar</Badge>}
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>

              {result.analysis && (
                <Section title={mode === 'brd' ? 'Implementation Plan' : 'Analysis'} icon="→" iconColor="blue" defaultOpen>
                  <p style={{ fontSize: 13.5, color: C.text2, lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{result.analysis}</p>
                </Section>
              )}

              {result.similar_routines?.length > 0 && (
                <Section title={`Similar Patterns (${result.similar_routines.length})`} icon="⊕" iconColor="purple">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {result.similar_routines.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: C.bg3, border: `1px solid ${C.border}`, borderRadius: R.md }}>
                        <span style={{ fontFamily: F.mono, fontSize: 12, color: C.accent, flex: 1 }}>{item.name}</span>
                        <span style={{ fontSize: 12, color: C.text3 }}>{item.desc}</span>
                        <span style={{ fontFamily: F.mono, fontSize: 10, background: C.greenDim, color: C.green, padding: '2px 6px', borderRadius: R.sm }}>{item.score}%</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {result.code && (
                <Section title="Generated Routine" icon="»" iconColor="green" defaultOpen>
                  <CodeBlock code={result.code} />
                </Section>
              )}

              {result.changes?.length > 0 && (
                <Section title={`Changes & Findings (${result.changes.length})`} icon="!" iconColor="amber">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {result.changes.map((c, i) => <ChangeItem key={i} type={c.type} text={c.text} />)}
                  </div>
                </Section>
              )}

              {result.compliance && (
                <Section title="Upgrade Safety & Compliance" icon="✓" iconColor="red">
                  <p style={{ fontSize: 13, color: C.text2, lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{result.compliance}</p>
                </Section>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  )
}
