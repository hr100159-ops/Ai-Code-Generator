const MODE_INSTRUCTIONS = {
  new:    'Write a new production-ready jBASE subroutine from scratch.',
  review: 'Review, fix, and optimise the provided jBASE routine.',
  brd:    'Analyse the BRD/requirement and produce a full T24 implementation plan, then write the required jBASE routine(s).',
  debug:  'Debug the issue described, identify root cause, and provide a fixed routine.',
}

const T24_MODULES = {
  AA:       'Arrangement Architecture (lending)',
  FT:       'Funds Transfer',
  MM:       'Money Market',
  FX:       'Forex',
  EB:       'EB core framework',
  CUSTOMER: 'Customer module',
  TREASURY: 'Treasury',
  DW:       'DW.EXPORT data warehouse',
  LC:       'Letter of Credit / Drawings',
  OTHER:    'General T24',
}

export function buildKbContext(docs, maxChars = 14000) {
  if (!docs.length) return ''
  let ctx = ''
  let remaining = maxChars
  for (const doc of docs) {
    if (remaining <= 0) break
    const chunk = doc.content.substring(0, remaining)
    ctx += `### ${doc.name}\n\`\`\`\n${chunk}\n\`\`\`\n\n`
    remaining -= chunk.length
  }
  return ctx
}

export function buildPrompt({ reqText, routinePaste, mode, module: mod, kbDocs, opts }) {
  const kbSection = kbDocs.length > 0 && opts.searchKb
    ? `\n\n## KNOWLEDGE BASE — EXISTING ROUTINES & DOCS\nUse these as reference for patterns, naming conventions, and similar implementations.\n\n${buildKbContext(kbDocs)}`
    : ''

  const routineSection = routinePaste?.trim()
    ? `\n\n## EXISTING ROUTINE TO ${mode === 'debug' ? 'DEBUG' : 'REVIEW/IMPROVE'}\n\`\`\`jbase\n${routinePaste.trim()}\n\`\`\``
    : ''

  return `You are a senior Temenos T24 R22 consultant and expert jBASE developer with deep expertise in T24 core banking modules and production-grade jBASE programming.

## TASK
Mode: ${mode.toUpperCase()} — ${MODE_INSTRUCTIONS[mode]}
Module: ${mod} — ${T24_MODULES[mod] || mod}

## REQUIREMENT
${reqText}${routineSection}${kbSection}

## MANDATORY CODING STANDARDS
${opts.upgradeSafe ? '- Framework calls only: EB.READ, F.READ, CALL OPF, EB.READLIST, EB.ENQUIRY.READ, F.WRITE. No direct OPEN/READ/WRITE bypassing T24 framework.' : ''}
${opts.errorHandling ? '- Full error handling on every file I/O: ON ERROR GOSUB, lock management, CLEARFILE guards.' : ''}
${opts.comments ? '- Inline comments explaining business logic and non-obvious T24-specific decisions.' : ''}
- NEVER include DEBUG statements.
- NEVER hardcode company IDs — use ID.COMPANY.
- Initialise all variables before use.
- Close all SELECT cursors.
- Follow T24 naming conventions: Y. prefix for locals, FN./F. for file handles.
${kbDocs.length > 0 ? '- Match naming conventions from the knowledge base.' : ''}

## RESPONSE FORMAT
Respond ONLY with valid JSON — no markdown fences around the JSON.

{
  "routine_name": "SUGGESTED.ROUTINE.NAME",
  "analysis": "For BRD: module breakdown, hook points, data model. For review/debug: root cause. For new: design rationale.",
  "similar_routines": [{ "name": "NAME", "desc": "Why relevant", "score": 85 }],
  "code": "Complete jBASE subroutine. Full code not a snippet. \\n for newlines.",
  "changes": [{ "type": "FIX|PERF|INFO|WARN", "text": "Description" }],
  "compliance": "Upgrade safety, framework compliance, performance notes."
}`
}

export function buildChatPrompt({ message, kbDocs, conversationHistory }) {
  const kbSection = kbDocs.length > 0
    ? `\n\nKnowledge base available (${kbDocs.length} docs):\n${buildKbContext(kbDocs, 6000)}`
    : ''

  const history = conversationHistory
    .slice(-6) // last 3 exchanges
    .map(m => `${m.role === 'user' ? 'Developer' : 'Assistant'}: ${m.content}`)
    .join('\n')

  return `You are a senior Temenos T24 R22 consultant and jBASE expert (Vexora AI). Answer concisely and technically. Focus on T24/jBASE specifics.${kbSection}

${history ? `\nConversation so far:\n${history}\n` : ''}
Developer: ${message}
Assistant:`
}
