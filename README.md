# Biblical Greek Learning App

A Next.js app for learning Biblical Greek from course materials. Features vocabulary, grammar topics, a quiz engine, John 3:16 reader, and an AI tutor.

## Getting Started

Copy the env file and fill in your tutor credentials:

```bash
cp .env.example .env.local
# Edit .env.local — never commit it
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding a new vocabulary set

1. Open `data/corpus.json`
2. Add a new object to the `vocabSets` array with a sequential `id`, a `name` like `"Set 3"`, and `entries[]` following the existing pattern
3. Add the matching topic entry to `lib/topics.ts` with `id: "vocabulary-set-3"`
4. Add the topic content handler in `app/topics/[topicId]/page.tsx` `TopicContent` switch
5. Redeploy (`git push` → Vercel auto-deploy)

## Architecture

- **Data**: `data/corpus.json` — single source of truth; edit offline from PDFs
- **Types**: `lib/corpus-types.ts` — TypeScript schema for the corpus
- **Loader**: `lib/corpus.ts` — typed accessor with build-time validation
- **Components**: `components/` — BreakView (BREAK), BuildStepper (BUILD), QuizEngine, John316Reader, TutorChat
- **Routes**: App Router — `/topics/[topicId]`, `/quiz`, `/john-316`, `/tutor`, `/api/tutor`
- **AI Tutor**: Server-side Route Handler at `/api/tutor`; key never sent to browser; streaming SSE; filters `reasoning_content`

## Env vars

| Variable | Purpose |
|---|---|
| `TUTOR_BASE_URL` | OpenAI-compatible endpoint base URL |
| `TUTOR_MODEL` | Model name (e.g. `Qwen3.6-35B-A3B-MTP`) |
| `TUTOR_API_KEY` | Secret API key — Vercel env var only, never committed |

## Original Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
