import { useState, useCallback } from 'react'
import { chatMessage } from '../lib/api'
import { buildChatPrompt } from '../lib/promptBuilder'

export function useChat(kbDocs) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your T24 R22 consultant. Ask me anything about jBASE routines, T24 modules, error fixes, or BRD implementation. What are you working on?',
    }
  ])
  const [loading, setLoading] = useState(false)

  const sendMessage = useCallback(async (text) => {
    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const prompt = buildChatPrompt({
        message: text,
        kbDocs,
        conversationHistory: messages,
      })
      const reply = await chatMessage(prompt)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${err.message}` }])
    } finally {
      setLoading(false)
    }
  }, [messages, kbDocs])

  const clearChat = useCallback(() => {
    setMessages([{
      role: 'assistant',
      content: 'Chat cleared. What can I help you with?',
    }])
  }, [])

  return { messages, loading, sendMessage, clearChat }
}
