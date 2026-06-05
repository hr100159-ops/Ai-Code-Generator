// Frontend API client — calls Netlify Functions via /api/* proxy

const BASE = '/api'

export async function generateCode(prompt) {
  const res = await fetch(`${BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, taskType: 'analysis' }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Server error ${res.status}`)
  }
  const data = await res.json()
  const raw = data.result || ''

  // Strip any accidental code fences
  const cleaned = raw.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    return {
      routine_name: 'GENERATED.ROUTINE',
      analysis: cleaned,
      similar_routines: [],
      code: '',
      changes: [],
      compliance: '',
    }
  }
}

export async function chatMessage(prompt) {
  const res = await fetch(`${BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, taskType: 'chat' }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Server error ${res.status}`)
  }
  const data = await res.json()
  return data.result || ''
}

export async function getHealth() {
  const res = await fetch(`${BASE}/health`)
  if (!res.ok) return null
  return res.json()
}
