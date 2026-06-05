// netlify/functions/health.js
// Returns current LLM provider config + connectivity status

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'claude'
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b'
const HAS_CLAUDE_KEY = !!(process.env.ANTHROPIC_API_KEY)

exports.handler = async () => {
  let ollamaOnline = false

  if (LLM_PROVIDER === 'ollama') {
    try {
      const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { signal: AbortSignal.timeout(3000) })
      ollamaOnline = res.ok
    } catch {
      ollamaOnline = false
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      provider: LLM_PROVIDER,
      claude: { configured: HAS_CLAUDE_KEY },
      ollama: { url: OLLAMA_BASE_URL, model: OLLAMA_MODEL, online: ollamaOnline },
    }),
  }
}
