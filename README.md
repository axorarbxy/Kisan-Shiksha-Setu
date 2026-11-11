# Kisan Shiksha Setu (KSS)

Frontend scaffold built with Next.js, React 19, TypeScript, and Tailwind CSS v4.

## Documentation

The ten project documentation links will be added when those documents are available.

## Development

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm test:e2e
```

## Data layer

API contracts and response validation live in `src/lib/api/schemas.ts` and
`src/lib/api/client.ts`. Domain hooks under `src/features/` use TanStack Query;
shared cache keys are in `src/lib/query/keys.ts`. With
`NEXT_PUBLIC_API_MOCKING=enabled`, MSW serves the API from in-memory fixtures.
Use `?scenario=empty`, `?scenario=unauthorized`, `?scenario=unprocessable`, or
`?scenario=server-error` to exercise list and error states. The development-only
`/design/data-layer` page demonstrates optimistic observation updates and rollback.
