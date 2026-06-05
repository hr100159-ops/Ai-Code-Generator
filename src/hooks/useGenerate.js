import { useState, useCallback } from 'react'
import { generateCode } from '../lib/api'
import { buildPrompt } from '../lib/promptBuilder'

const STATUS_MSGS = [
  'Searching knowledge base for similar patterns...',
  'Analysing T24 module requirements...',
  'Reviewing jBASE framework compliance...',
  'Generating production-ready routine...',
  'Running upgrade-safety checks...',
  'Compiling change summary...',
]

export function useGenerate() {
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const generate = useCallback(async (params) => {
    setLoading(true)
    setError(null)
    setResult(null)

    let idx = 0
    setStatusMsg(STATUS_MSGS[0])
    const interval = setInterval(() => {
      idx = (idx + 1) % STATUS_MSGS.length
      setStatusMsg(STATUS_MSGS[idx])
    }, 2200)

    try {
      const prompt = buildPrompt(params)
      const output = await generateCode(prompt)
      setResult(output)
      return output
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      clearInterval(interval)
      setLoading(false)
      setStatusMsg('')
    }
  }, [])

  return { generate, loading, statusMsg, result, error }
}
