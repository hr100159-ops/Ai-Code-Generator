# T24 AI Code Studio — Vexora AI Standard Stack

React 18 + Netlify Functions + Claude/Ollama dual provider

---

## Quick Start

```bash
npm install
npm start        # http://localhost:3000
```

For local Netlify Functions (needed for API calls locally):
```bash
npm install -g netlify-cli
netlify dev      # http://localhost:8888
```

---

## Deploy to Netlify

### Option A — Drag & Drop (fastest)
```bash
npm run build
# Drag the /build folder to netlify.com/drop
```

### Option B — GitHub + Auto Deploy
1. Push to GitHub
2. Netlify → Add New Site → Import from GitHub
3. Build command: `npm run build`
4. Publish directory: `build`
5. Add environment variables (see below)

---

## Environment Variables

Set these in Netlify → Site Configuration → Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes (Claude mode) | Your `sk-ant-...` key |
| `LLM_PROVIDER` | No | `claude` (default) or `ollama` |
| `OLLAMA_BASE_URL` | Ollama mode | e.g. `http://your-server:11434` |
| `OLLAMA_MODEL` | No | `qwen2.5:7b` (default) or `llama3.1:8b` |

---

## LLM Provider Modes

### Claude Mode (default)
```
LLM_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-...
```
- Chat → `claude-haiku-4-5-20251001` (fast, cheap)
- Analysis/Generate → `claude-sonnet-4-20250514` (full power)

### Ollama Mode (on-prem)
```
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://your-server:11434
OLLAMA_MODEL=qwen2.5:7b
```

Install Ollama and pull a model:
```bash
# Install: https://ollama.ai
ollama pull qwen2.5:7b       # recommended for T24/code
ollama pull llama3.1:8b      # alternative
ollama serve                  # starts on :11434
```

---

## Project Structure

```
t24-vexora/
├── netlify.toml
├── package.json
├── public/
│   └── index.html
├── netlify/
│   └── functions/
│       ├── generate.js       ← main AI proxy (Claude + Ollama)
│       └── health.js         ← provider status check
└── src/
    ├── App.js
    ├── index.js
    ├── lib/
    │   ├── tokens.js         ← design tokens
    │   ├── api.js            ← frontend → Netlify Functions client
    │   └── promptBuilder.js  ← T24-specific prompt engineering
    ├── hooks/
    │   ├── useKnowledgeBase.js  ← KB state + localStorage persistence
    │   ├── useGenerate.js       ← generation state
    │   └── useChat.js           ← chat state
    └── components/
        ├── UI.js              ← Btn, Badge, Section, CodeBlock, Toast...
        ├── Sidebar.js
        ├── KnowledgeBaseTab.js
        ├── RequirementsTab.js
        ├── OutputTab.js
        └── ChatTab.js
```

---

## Roadmap: Adding ChromaDB RAG Later

When ready to replace localStorage KB with real vector search:

1. Deploy a Python FastAPI server (Railway/Render free tier):
```python
# server.py
from fastapi import FastAPI
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

app = FastAPI()
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)

@app.post("/kb/add")    # add document
@app.post("/kb/search") # similarity search
@app.delete("/kb/clear")
```

2. Add env var: `RAG_SERVER_URL=https://your-rag-server.railway.app`

3. Update `netlify/functions/generate.js` to call RAG server for context instead of injecting full KB text.

---

Built by Vexora AI. T24 R22 · jBASE · Anthropic Claude · Ollama.
