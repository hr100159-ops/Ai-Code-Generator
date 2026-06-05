import React from 'react'
import { ArrowRight } from 'lucide-react'
import { C, F, R } from '../lib/tokens'
import { Btn, ChipGroup, Checkbox, FieldGroup, LoadingDots, useToast } from './UI'

const MODES = [
  { value: 'new',    label: 'New Routine'    },
  { value: 'review', label: 'Review / Fix'   },
  { value: 'brd',    label: 'BRD → T24 Plan' },
  { value: 'debug',  label: 'Debug Issue'    },
]

const MODULES = [
  { value: 'AA', label: 'AA' }, { value: 'FT', label: 'FT' },
  { value: 'MM', label: 'MM' }, { value: 'FX', label: 'FX' },
  { value: 'EB', label: 'EB' }, { value: 'CUSTOMER', label: 'Customer' },
  { value: 'TREASURY', label: 'Treasury' }, { value: 'DW', label: 'DW.EXPORT' },
  { value: 'LC', label: 'LC/Draw' }, { value: 'OTHER', label: 'Other' },
]

const PLACEHOLDERS = {
  new:    'Describe the routine you need.\n\nExample: "Write a VERSION routine for FT.TRANSACTION that scores fraud risk by calling an external API"',
  review: 'Describe known issues (optional — I\'ll review the pasted code regardless).\n\nExample: "This is slow in batch — SELECT inside a loop"',
  brd:    'Paste or describe the business requirement.\n\nExample: "When a new FT over USD 50,000 is authorised, trigger a compliance hold and send an AML notification"',
  debug:  'Describe the bug or unexpected behaviour.\n\nExample: "MM-25140-00149;9 (curr 9) is missing from the DW export — record is still live"',
}

export default function RequirementsTab({ mode, onModeChange, module: mod, onModuleChange, reqText, onReqTextChange, routinePaste, onRoutinePasteChange, opts, onOptsChange, kbDocs, onGenerate, loading }) {
  const { show } = useToast()
  const showPaste = ['review', 'debug'].includes(mode)
  const kbChars = kbDocs.reduce((s, d) => s + d.content.length, 0)

  const handleGenerate = () => {
    if (!reqText.trim()) { show('Describe your requirement first'); return }
    onGenerate()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 500, color: C.text, letterSpacing: '-0.01em' }}>Requirements</h1>
        <p style={{ fontSize: 13, color: C.text3, marginTop: 3 }}>Describe what you need — new routine, review, debug, or BRD analysis</p>
      </div>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: 3, background: C.bg2, padding: 4, borderRadius: R.lg, border: `1px solid ${C.border}`, width: 'fit-content' }}>
        {MODES.map(m => (
          <button key={m.value} onClick={() => onModeChange(m.value)} style={{
            padding: '6px 14px', fontSize: 12, fontFamily: F.ui, cursor: 'pointer',
            borderRadius: R.md, transition: 'all 0.15s',
            border: mode === m.value ? `1px solid ${C.border2}` : '1px solid transparent',
            background: mode === m.value ? C.bg4 : 'transparent',
            color: mode === m.value ? C.text : C.text3,
          }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Module */}
      <FieldGroup label="T24 Module">
        <ChipGroup options={MODULES} value={mod} onChange={onModuleChange} />
      </FieldGroup>

      {/* Requirement */}
      <FieldGroup label="Requirement / BRD / Issue">
        <textarea value={reqText} onChange={e => onReqTextChange(e.target.value)} placeholder={PLACEHOLDERS[mode]} style={{ width: '100%', minHeight: 160, fontFamily: F.ui, fontSize: 13.5, lineHeight: 1.7, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: R.lg, color: C.text, padding: '13px 15px', outline: 'none', resize: 'vertical', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = C.border3} onBlur={e => e.target.style.borderColor = C.border} />
      </FieldGroup>

      {/* Existing routine */}
      {showPaste && (
        <FieldGroup label={`Existing Routine to ${mode === 'debug' ? 'Debug' : 'Review/Fix'}`}>
          <textarea value={routinePaste} onChange={e => onRoutinePasteChange(e.target.value)} placeholder="Paste the jBASE routine here..." style={{ width: '100%', minHeight: 200, display: 'block', fontFamily: F.mono, fontSize: 12.5, lineHeight: 1.65, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: R.lg, color: C.text, padding: '13px 16px', outline: 'none', resize: 'vertical' }} />
        </FieldGroup>
      )}

      {/* Options */}
      <FieldGroup label="Options">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <Checkbox label="Upgrade-safe (T24 R22 framework calls only)" checked={opts.upgradeSafe} onChange={v => onOptsChange({ ...opts, upgradeSafe: v })} />
          <Checkbox label="Full error handling" checked={opts.errorHandling} onChange={v => onOptsChange({ ...opts, errorHandling: v })} />
          <Checkbox label="Inline comments" checked={opts.comments} onChange={v => onOptsChange({ ...opts, comments: v })} />
          <Checkbox label="Search knowledge base" checked={opts.searchKb} onChange={v => onOptsChange({ ...opts, searchKb: v })} />
        </div>
      </FieldGroup>

      {/* Submit */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingTop: 4 }}>
        <span style={{ fontSize: 12, color: kbDocs.length > 0 ? C.amber : C.text3 }}>
          {kbDocs.length === 0 ? 'No KB loaded' : `${kbDocs.length} doc${kbDocs.length > 1 ? 's' : ''} · ${(kbChars / 1024).toFixed(1)}kb in context`}
        </span>
        <Btn variant="primary" size="lg" onClick={handleGenerate} disabled={loading}>
          {loading ? <><LoadingDots color="rgba(255,255,255,0.8)" /> Generating...</> : <><ArrowRight size={15} /> Generate</>}
        </Btn>
      </div>

    </div>
  )
}
