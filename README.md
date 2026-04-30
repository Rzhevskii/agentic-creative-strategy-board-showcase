# Agentic Creative Strategy Board

## Status
Work-in-progress MVP originally created in the context of Gemini Live Agent Challenge 2026 in the Creative Storyteller category.

This repository is a **public showcase layer**, not the full private working repository. It is designed to make the project understandable to an external reviewer in a few minutes while keeping publication safety intact.

The current state is a **functional product foundation** with clear architecture, shared contracts, demo fixtures, selected implementation excerpts, and publication-safe documentation. The contest-grade live path and final demo packaging still require hardening.

## Problem
Manual creative research is slow and fragmented. Founders, operators, and marketers often review swipe files, landing pages, ads, screenshots, and notes by hand. The goal of this project is to replace that fragmented workflow with a bounded agentic pipeline that turns a brief, a reference image, and selected source links into a strategic creative board for the next advertising experiment.

## Product Idea
The product is designed to feel less like “search + summary” and more like a creative strategist.

The user provides:
1. a structured marketing brief;
2. a reference image;
3. selected competitor or source links.

The system performs bounded discovery, extraction, normalization, and synthesis, then returns a board-first artifact with:
- pattern clusters;
- saturated or overused angles;
- whitespace and opportunity notes;
- cited sources;
- a next-test brief;
- an optional audio recap and story layer.

## Judged MVP Path
The intended judged path is intentionally narrow and reliable:
1. typed brief;
2. image upload;
3. selected source URLs;
4. run creation;
5. streamed progress;
6. board-first UI;
7. citations and grounding metadata;
8. fallback/demo mode for stable review.

## Architecture
- Frontend: Next.js board-style web app
- Backend: FastAPI service
- Progress transport: SSE
- API style: run-oriented API
- Frontend hosting target: Firebase App Hosting
- Backend hosting target: Cloud Run
- Data/artifact storage target: Firestore + Cloud Storage
- Contract: shared `BoardPayload` schema
- Demo reliability: live path + fallback/demo mode

See also:
- `docs/architecture.md`
- `docs/roadmap.md`
- `docs/mimo-api-usage.md`
- `docs/showcase-scope.md`

## Main API Shape
- `POST /api/runs`
- `GET /api/runs/{id}/events`
- `GET /api/runs/{id}`

## Current Implementation
This is not a spec-only concept. The original private working project already includes:
- frontend app with board-style UI;
- backend service with FastAPI;
- run/session models;
- SSE event streaming;
- live/fallback execution paths;
- shared schemas and examples;
- fixtures for briefs, payloads, sources, and media;
- deploy and smoke scripts;
- tests;
- board rendering for sources, pattern clusters, overused angles, opportunities, and next-test brief.

This showcase repo includes the **public-safe subset** of that work:
- rewritten docs;
- sanitized fixtures;
- shared contracts;
- a real demo-safe backend slice with routes, models, store, SSE, and tests;
- a real frontend slice with app routes, board rendering, run workspace, validation, and contracts;
- publication audit and checklist materials.

## Known Gaps
The project is still work in progress. The main remaining gaps are:
- live path hardening;
- cleaner discovery and intake normalization;
- selected-URL extraction as a fully stable path;
- citation-ready metadata for all extracted claims;
- stable cluster formation and deduplication;
- stricter evidence-vs-inference discipline;
- lower-latency hosted runs;
- audio recap completion;
- judge-ready deployment proof;
- recorded happy path;
- budget and rate-limit guards.

## Planned MiMo API Usage
MiMo API would be evaluated as an additional base model in the same agentic pipeline for:
- long-horizon agentic reasoning;
- creative strategy synthesis;
- extraction normalization;
- evidence-vs-inference checking;
- cluster hygiene and deduplication;
- next-test brief generation;
- audio recap generation;
- model comparison against Gemini / GPT / Claude-based runs.

More detail: `docs/mimo-api-usage.md`

## Broader Agentic R&D Workflow
This project is also a concrete example of a broader agentic research-and-development workflow. The workflow uses structured docs, fixtures, schemas, code review, testing, and reproducible context to move from idea to prototype:
1. analyze source materials;
2. define architecture and contracts;
3. generate implementation plans;
4. build and review code slices;
5. validate with tests and smoke flows;
6. document decisions and gaps;
7. preserve reproducible evaluation context.

## Repository Structure
```text
agentic-creative-strategy-board-showcase/
├── README.md
├── LICENSE
├── .env.example
├── .gitignore
├── THIRD_PARTY.md
├── backend/
│   ├── README.md
│   ├── requirements.txt
│   ├── app/
│   ├── tests/
│   └── examples/
├── frontend/
│   ├── README.md
│   ├── package.json
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── types/
│   └── examples/
├── shared/
│   ├── README.md
│   ├── schemas/
│   └── examples/
├── fixtures/
│   ├── README.md
│   ├── briefs/
│   ├── payloads/
│   └── sources/
├── scripts/
│   ├── README.md
│   └── audit_publication_readiness.py
└── docs/
    ├── architecture.md
    ├── roadmap.md
    ├── local_setup.md
    ├── demo_fixtures.md
    ├── publication_audit.md
    ├── publication_checklist.md
    ├── publication_summary.md
    ├── mimo-api-usage.md
    ├── showcase-scope.md
    └── assets/
```

## Running Locally
This showcase repo is fixture-driven and demo-safe. It does **not** include the full private deployment wiring, but it now includes real public-safe backend and frontend slices.

Minimal local review steps:

```bash
python3 scripts/audit_publication_readiness.py
python3 -m http.server 8000
```

Then open the repo root in the browser if you want to inspect docs and assets locally.

See `docs/local_setup.md` for details.

## Demo Mode
Sanitized fixtures are included to demonstrate the board-first experience without depending on unstable live discovery, private credentials, or external model availability.

See:
- `fixtures/briefs/demo_brief.json`
- `fixtures/sources/demo_sources.json`
- `fixtures/payloads/demo_board_payload.json`
- `docs/demo_fixtures.md`

## Tests
The original private working project contains a broader test surface. This public showcase includes:
- a publication-readiness audit script;
- backend route and SSE contract tests in `backend/tests/`;
- schema/example consistency artifacts;
- real frontend/backend implementation slices for reviewer inspection.

## License
Apache-2.0
