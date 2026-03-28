# CyberVerdict-AI

CyberVerdict-AI is an AI-powered web app for analyzing chat disputes and turning them
into a structured verdict.

This repository currently stores the actual application inside the [`cyber-court`](./cyber-court)
subdirectory.

## Main App

- App directory: [`cyber-court`](./cyber-court)
- Project README: [`cyber-court/README.md`](./cyber-court/README.md)
- Optimization plan: [`cyber-court/docs/product-optimization-plan.md`](./cyber-court/docs/product-optimization-plan.md)

## What It Does

- Accepts pasted chat logs
- Calls an AI model to analyze both sides
- Returns structured results such as score split, summary, key points, logic tags, and verdict text
- Supports shareable poster generation

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- ECharts

## Run Locally

```bash
cd cyber-court
pnpm install
pnpm dev
```

Then open:

```text
http://localhost:3000
```
