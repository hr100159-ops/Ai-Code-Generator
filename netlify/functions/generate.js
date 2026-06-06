// netlify/functions/generate.js
// Vexora AI — T24 Code Studio
// Supports: Claude (Haiku/Sonnet) and Ollama (Qwen2.5/Llama3.1)
// Switch via: LLM_PROVIDER=claude | LLM_PROVIDER=ollama

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'claude'
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b'

// Claude models per task type
const CLAUDE_MODELS = {
  chat:     'claude-haiku-4-5-20251001',   // latest Haiku — fast + cheap for quick queries
  analysis: 'claude-opus-4-8',             // latest Opus — full power for generation + review
}

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders(),
    }
  }

  if (event.httpMethod !== 'POST') {
    return respond(405, { error: 'Method not allowed' })
  }

  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return respond(400, { error: 'Invalid JSON body' })
  }

  const { prompt, taskType = 'analysis' } = body

  if (!prompt) {
    return respond(400, { error: 'prompt is required' })
  }

  try {
    let result
    if (LLM_PROVIDER === 'ollama') {
      result = await callOllama(prompt)
    } else {
      result = await callClaude(prompt, taskType)
    }
    return respond(200, { result, provider: LLM_PROVIDER })
  } catch (err) {
    console.error(`[generate] Error:`, err.message)
    return respond(500, { error: err.message })
  }
}

// ── CLAUDE ──────────────────────────────────────────────
async function callClaude(prompt, taskType) {
  if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set')

  const model = CLAUDE_MODELS[taskType] || CLAUDE_MODELS.analysis

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: taskType === 'chat' ? 1024 : 8000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Anthropic API error ${res.status}`)
  }

  const data = await res.json()
  return data.content?.[0]?.text || ''
}

// ── OLLAMA ──────────────────────────────────────────────
async function callOllama(prompt) {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
    }),
  })

  if (!res.ok) {
    throw new Error(`Ollama error ${res.status} — is Ollama running at ${OLLAMA_BASE_URL}?`)
  }

  const data = await res.json()
  return data.response || ''
}

// ── HELPERS ─────────────────────────────────────────────
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function respond(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    body: JSON.stringify(body),
  }
}
