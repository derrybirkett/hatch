# Hatch — Tombstone

`hatch` has been retired as a generator CLI. Its heavyweight stack thesis is preserved as the `full` profile in [stack](https://github.com/derrybirkett/stack), and several specific artifacts have been salvaged into [stack](https://github.com/derrybirkett/stack), [shulkerbox](https://github.com/derrybirkett/shulkerbox), and [idea](https://github.com/derrybirkett/idea). The EJS generator and story-driven scaffolding are not preserved.

## Salvaged: The Full Stack Profile

Hatch's thesis — Nx monorepo + NestJS API + React+Vite SPA + Next.js website + Postgres-in-Docker + custom JWT auth — survives as one of two profiles in stack.

| Was in hatch | Now lives in |
|---|---|
| The full thesis (Nx, 3 apps, 3 libs, custom auth) | [stack/profiles/full.yaml](https://github.com/derrybirkett/stack) |
| Generated apps (website, dashboard, api) | [stack/templates/full/](https://github.com/derrybirkett/stack) |
| Generated libs (ui, auth, shared) | [stack/templates/full/libs/](https://github.com/derrybirkett/stack) |
| docker-compose with Postgres + Redis | [stack/templates/full/docker-compose.yml](https://github.com/derrybirkett/stack) |
| Multi-stage Dockerfiles | [stack/templates/full/](https://github.com/derrybirkett/stack) |

Bloom's default profile is `lite` (Vercel + Supabase + single Next.js app), not `full`. Pick `full` only when regulated requirements, on-prem needs, or post-validation scale demand it.

## Salvaged: Generic Artifacts (Both Profiles)

These age well regardless of which stack profile a product picks:

| Was in hatch | Now lives in |
|---|---|
| Playwright auth-flow test template | [stack/templates/e2e/auth-flow.spec.ts](https://github.com/derrybirkett/stack) |
| CI workflow (typecheck + lint + build + e2e + audit) | [stack/configs/github/ci.yml](https://github.com/derrybirkett/stack) |
| Deploy workflow patterns (Vercel + Railway + Docker Hub) | [stack/docs/deployment-options.md](https://github.com/derrybirkett/stack) |
| 5-component UI baseline (Button, Input, Card, Badge, Alert) | [stack/docs/ui-baseline.md](https://github.com/derrybirkett/stack) |
| Architecture diagram pattern (system / auth flow / data flow) | [idea/templates/architecture.md](https://github.com/derrybirkett/idea) |
| Production-readiness checklist | [shulkerbox/skills/development/production-ready/SKILL.md](https://github.com/derrybirkett/shulkerbox) |
| ARCHITECTURE.md / DEPLOYMENT.md voice and structure | [stack/docs/](https://github.com/derrybirkett/stack) |

## Retired (Not Salvaged)

- **The EJS generator CLI** (`hatch init`, commander + inquirer + ejs). Content-first principle: templates over generators. The starter lives as static files under `stack/templates/`, no generation step.
- **Story-driven scaffolding** (parsers/, generators/, intent extraction). Replaced by `idea/` templates that humans fill in directly.
- **Twelve top-level markdown files** (README, INDEX, EXECUTIVE_SUMMARY, QUICK_REFERENCE, GETTING_STARTED, CHECKLIST, PHASE_1_COMPLETE, PLAN, ARCHITECTURE, WORKFLOWS, TEST_RESULTS, TESTING_SUMMARY). Consolidated into `stack/README.md` plus `stack/docs/`.
- **The "Story-Driven Generation" feature pitch.** Bloom's idea repo handles intent capture as templates, not parsers.

## Why Hatch Was Retired

Three reasons:

1. **The CLI was the wrong abstraction.** Generators encode opinions in code; opinions in code rot faster than opinions in markdown. Bloom's content-first principle says templates outlast generators.
2. **The thesis is one of two, not the only one.** Hatch's heavyweight stack is right for around 10% of products. Forcing it on every bootstrap added drag for the 90% case. Splitting into `lite` and `full` profiles in stack lets the right thesis match the product.
3. **Documentation outweighed the implementation.** Twelve top-level markdown files for a CLI is a sign the project was being explained more than built. The salvaged artifacts above are the parts that actually compounded value.

## What Was Not Worth Salvaging

The EJS generator code, the story parser, the intent extractor, the entity inference logic, the multi-phase implementation roadmap (PHASE_1_COMPLETE etc.), the comparison tables with create-next-app / T3 / RedwoodJS.

## Final Version

`hatch` v0.7.0, released March 2026.

## Recovery

This repository remains accessible at [github.com/derrybirkett/hatch](https://github.com/derrybirkett/hatch) for archeological reference and to extract any specific snippets that were not called out above. It receives no further updates. New product bootstrap happens via the `stack` repo's lite or full profile.
