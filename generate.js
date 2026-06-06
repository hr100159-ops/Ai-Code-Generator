// netlify/functions/generate.js
// Vexora AI — T24 Code Studio
// 504 fix: Haiku for all tasks on free tier — fast, reliable, under 10s

exports.config = { maxDuration: 26 }

const LLM_PROVIDER    = process.env.LLM_PROVIDER     || 'claude'
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL   || 'http://localhost:11434'
const OLLAMA_MODEL    = process.env.OLLAMA_MODEL      || 'qwen2.5:7b'

// FREE TIER FIX:
// Haiku is 10x faster than Sonnet/Opus — stays well within 26s limit
// Quality is still excellent for T24 jBASE with a good system prompt
const CLAUDE_MODELS = {
  chat:     'claude-haiku-4-5-20251001',  // ~1-2s
  analysis: 'claude-haiku-4-5-20251001',  // ~3-8s — fast enough, good quality
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders() }
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
  if (!prompt) return respond(400, { error: 'prompt is required' })

  try {
    const result = LLM_PROVIDER === 'ollama'
      ? await callOllama(prompt)
      : await callClaude(prompt, taskType)
    return respond(200, { result, provider: LLM_PROVIDER })
  } catch (err) {
    console.error('[generate] Error:', err.message)
    if (err.name === 'AbortError') {
      return respond(504, { error: 'Request timed out. Try shortening your requirement or reducing KB size.' })
    }
    return respond(500, { error: err.message })
  }
}

async function callClaude(prompt, taskType) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not set in Netlify environment variables')
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20000) // 20s hard limit

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: CLAUDE_MODELS[taskType] || CLAUDE_MODELS.analysis,
        max_tokens: taskType === 'chat' ? 1024 : 4096, // 4096 plenty for a routine
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error?.message || `Anthropic API error ${res.status}`)
    }

    const data = await res.json()
    return data.content?.[0]?.text || ''
  } finally {
    clearTimeout(timer)
  }
}

async function callOllama(prompt) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20000)

  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false }),
    })
    if (!res.ok) throw new Error(`Ollama error ${res.status}`)
    const data = await res.json()
    return data.response || ''
  } finally {
    clearTimeout(timer)
  }
}

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
