import React, { useState, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import KnowledgeBaseTab from './components/KnowledgeBaseTab'
import RequirementsTab from './components/RequirementsTab'
import OutputTab from './components/OutputTab'
import ChatTab from './components/ChatTab'
import { ToastProvider, useToast } from './components/UI'
import { useKnowledgeBase } from './hooks/useKnowledgeBase'
import { useGenerate } from './hooks/useGenerate'
import { useChat } from './hooks/useChat'
import { C } from './lib/tokens'

function AppInner() {
  const { show } = useToast()
  const [tab, setTab] = useState('kb')

  // Form state
  const [mode, setMode]               = useState('new')
  const [module, setModule]           = useState('AA')
  const [reqText, setReqText]         = useState('')
  const [routinePaste, setRoutinePaste] = useState('')
  const [opts, setOpts] = useState({ upgradeSafe: true, errorHandling: true, comments: true, searchKb: true })

  const kb       = useKnowledgeBase()
  const gen      = useGenerate()
  const chat     = useChat(kb.docs)

  const handleGenerate = useCallback(async () => {
    setTab('out')
    try {
      await gen.generate({ reqText, routinePaste, mode, module, kbDocs: kb.docs, opts })
    } catch (err) {
      show(`Error: ${err.message}`)
    }
  }, [reqText, routinePaste, mode, module, kb.docs, opts, gen, show])

  const TAB_CONTENT = {
    kb: (
      <KnowledgeBaseTab
        docs={kb.docs} totalChars={kb.totalChars}
        onAddFiles={kb.addFiles} onAddDoc={kb.addDoc}
        onRemove={kb.removeDoc} onClear={kb.clearAll}
      />
    ),
    req: (
      <RequirementsTab
        mode={mode}             onModeChange={setMode}
        module={module}         onModuleChange={setModule}
        reqText={reqText}       onReqTextChange={setReqText}
        routinePaste={routinePaste} onRoutinePasteChange={setRoutinePaste}
        opts={opts}             onOptsChange={setOpts}
        kbDocs={kb.docs}
        onGenerate={handleGenerate}
        loading={gen.loading}
      />
    ),
    out: (
      <OutputTab
        result={gen.result} loading={gen.loading}
        statusMsg={gen.statusMsg} module={module} mode={mode}
      />
    ),
    chat: (
      <ChatTab
        messages={chat.messages} loading={chat.loading}
        onSend={chat.sendMessage} onClear={chat.clearChat}
      />
    ),
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.bg }}>
      <Sidebar
        activeTab={tab} onTabChange={setTab}
        kbCount={kb.docs.length} hasOutput={!!gen.result}
      />
      <main style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ height: '100vh', overflowY: 'auto', padding: '28px 36px 40px' }}>
          {TAB_CONTENT[tab]}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <>
      <AppInner />
      <ToastProvider />
    </>
  )
}
