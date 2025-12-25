# OS Portfolio (Next.js + TypeScript)

A phone-inspired portfolio UI rebuilt with Next.js, React, and TypeScript.

## Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

## Hugging Face Inference API

Set your token in `.env.local`:

```bash
HF_ACCESS_TOKEN=your_token_here
HF_MODEL=deepseek-ai/DeepSeek-V3.2
HF_PROVIDER=novita
HF_EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

Use the server-side endpoint:

```bash
curl -X POST http://localhost:3000/api/inference ^
  -H "Content-Type: application/json" ^
  -d "{\"messages\":[{\"role\":\"user\",\"content\":\"Say hello from the OS UI\"}]}"
```

Optional parameters: `model`, `provider`, `maxTokens`, `temperature`, `topP`, `repetitionPenalty`.

## RAG (Portfolio Context)

Update `data/portfolio.md` with your real portfolio info. The API will embed it
and retrieve relevant chunks for chat answers.

## Build

```bash
npm run build
npm start
```

## Lint

```bash
npm run lint
```
