# CyberVerdict-AI

CyberVerdict-AI is a Next.js web app that turns messy chat disputes into a structured AI verdict.
Users can paste a conversation, run an analysis, and get a result with score split, summary, key points,
logic labels, verdict text, recent local history, and a shareable poster.

## Features

- Chat dispute analyzer with structured verdict output
- Result summary, score split, key sentence, key points, and logic flaw tags
- Poster generation for sharing the analysis result
- Local recent-history view in the browser
- Development-only API settings modal for testing different model providers
- Static guide and privacy pages

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- ECharts
- OpenAI-compatible API client

## Project Structure

```text
app/
  api/verdict/          AI verdict route
  components/           UI components
  components/home/      landing/analyzer stage components
  guide/                usage guide page
  privacy/              privacy page
  types/                shared type definitions
docs/
  product-optimization-plan.md
```

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

If you use npm:

```bash
npm install
```

### 2. Configure environment variables

Create or update `.env.local`:

```bash
OPENAI_API_KEY=your-key
OPENAI_BASE_URL=https://api.deepseek.com
AI_MODEL=deepseek-chat
```

Available variables:

- `OPENAI_API_KEY`: API key used by the server route
- `OPENAI_BASE_URL`: OpenAI-compatible provider base URL
- `AI_MODEL`: model name

### 3. Run the project

```bash
pnpm dev
```

Then open:

```text
http://localhost:3000
```

## Available Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Notes

- The in-app API settings modal is intended for local debugging only.
- A real production deployment should keep provider credentials on the server.
- Browser local storage is used for recent analysis history in the current version.

## Roadmap

The project is being upgraded from a demo into a more product-ready application.
Planned work includes:

- better UI polish and information hierarchy
- safer backend model access patterns
- persistent history and service-side storage
- authentication, rate limiting, and monitoring

See:

- [`docs/product-optimization-plan.md`](./docs/product-optimization-plan.md)

## License

No license has been added yet. If you want this repository to be reusable by others,
add an explicit license file.
