# Cyber Court

Cyber Court is a Next.js prototype for analyzing chat disputes with an AI model.
It accepts a pasted conversation, asks a model for a structured verdict, and renders
an interactive result view with a score split, key sentence, verdict text, and shareable poster.

## Current status

This repository is being upgraded from a single-page demo into a more production-ready product baseline.
The current phase focuses on:

- fixing corrupted copy and metadata
- separating the main page into smaller UI stages
- hardening the `/api/verdict` route with request and response validation
- moving API key entry into an explicitly development-only path

## Local development

1. Install dependencies.
2. Configure `.env.local` with a provider key and model.
3. Start the app:

```bash
pnpm dev
```

4. Open `http://localhost:3000`.

## Environment variables

- `OPENAI_API_KEY`: provider API key used by the server route
- `OPENAI_BASE_URL`: provider-compatible base URL
- `AI_MODEL`: model name to call

## Notes

- The in-app API settings modal is for local debugging only.
- A real production deployment should keep provider credentials on the server.
