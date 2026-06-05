import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 't24_kb_docs'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(docs) {
  try {
    // Only persist name + first 50kb of content to avoid storage limits
    const slim = docs.map(d => ({ ...d, content: d.content.substring(0, 51200) }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slim))
  } catch (e) {
    console.warn('KB storage full:', e.message)
  }
}

export function useKnowledgeBase() {
  const [docs, setDocs] = useState(loadFromStorage)

  // Persist on every change
  useEffect(() => { saveToStorage(docs) }, [docs])

  const addDoc = useCallback((doc) => {
    setDocs(prev => {
      // Avoid duplicates by name
      const exists = prev.find(d => d.name === doc.name)
      if (exists) return prev.map(d => d.name === doc.name ? { ...d, content: doc.content } : d)
      return [...prev, { id: Date.now() + Math.random(), ...doc }]
    })
  }, [])

  const removeDoc = useCallback((id) => {
    setDocs(prev => prev.filter(d => d.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setDocs([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const addFiles = useCallback(async (files) => {
    for (const file of files) {
      const content = await readFileText(file)
      addDoc({ name: file.name, content, type: 'file' })
    }
  }, [addDoc])

  const totalChars = docs.reduce((s, d) => s + d.content.length, 0)

  return { docs, addDoc, removeDoc, clearAll, addFiles, totalChars }
}

function readFileText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}
