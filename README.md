# Kisan Shiksha Setu (KSS)

Frontend scaffold built with Next.js, React 19, TypeScript, and Tailwind CSS v4.

## Authentication and onboarding

Authentication uses TanStack Query for the current user (`GET /auth/me`) and
backend-managed HttpOnly session cookies. Middleware only performs an optimistic
cookie check; API authorization remains the backend's responsibility. The login
and registration forms use the MSW auth endpoints when
`NEXT_PUBLIC_API_MOCKING=enabled`, and onboarding progress is saved in the
versioned onboarding store until its profile update succeeds.
The browser-side session cookie used by MSW is development-only; production
session cookies must be issued and cleared by the backend with `HttpOnly`.
Set `NEXT_PUBLIC_SITE_URL` to the canonical deployment URL for sitemap and
Open Graph metadata. `NEXT_PUBLIC_SURVEY_URL` optionally embeds the validation
form, and `NEXT_PUBLIC_CONTACT_EMAIL` configures the public contact link.

## Development

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm test:e2e
```

## End-to-end tests and quality gates

Playwright runs the E2E suite against the MSW-backed production build in both
Desktop Chrome and Pixel 7 projects. The setup project signs in the three demo
roles and saves storage states under the ignored `e2e/.auth/` directory. Each
test resets its browser's mock API data before running.

```bash
pnpm typecheck
pnpm lint
pnpm exec playwright install chromium
pnpm test:e2e
```

By default, Playwright builds and starts the production app. For a faster local
iteration, set `PLAYWRIGHT_USE_DEV_SERVER=1` before `pnpm test:e2e`. Visual
baselines live beside the visual spec; use
`pnpm exec playwright test e2e/visual.spec.ts --update-snapshots` to refresh
them intentionally. The CI workflow installs dependencies from the frozen
lockfile, runs type and lint checks, and executes the full E2E suite.

## Data layer

API contracts and response validation live in `src/lib/api/schemas.ts` and
`src/lib/api/client.ts`. Domain hooks under `src/features/` use TanStack Query;
shared cache keys are in `src/lib/query/keys.ts`. With
`NEXT_PUBLIC_API_MOCKING=enabled`, MSW serves the API from in-memory fixtures.
Use `?scenario=empty`, `?scenario=unauthorized`, `?scenario=unprocessable`, or
`?scenario=server-error` to exercise list and error states. The development-only
`/design/data-layer` page demonstrates optimistic observation updates and rollback.

Browser-only UI and onboarding state live in `src/stores/`. Sidebar preferences,
onboarding progress, and unsent observation drafts are persisted locally; queued
observation drafts are replayed when the browser comes back online. API data
remains in TanStack Query.

## Public pages

The public landing, how-it-works, evidence, and survey pages are server-rendered
from typed copy in `src/content/public-pages.ts`. Only the how-it-works role
tabs are interactive. `NEXT_PUBLIC_SURVEY_URL` enables the optional survey
embed; `NEXT_PUBLIC_SITE_URL` configures the sitemap and canonical Open Graph
base. The application providers are scoped to authenticated, auth, and design
routes so public pages do not load query or mock-service-worker clients.
