# Publication Audit

## Repository status
This showcase repository was created as a separate local sibling repository so the original working project remains untouched.

## Existing components represented here
- Frontend: selected architecture and rendering excerpts
- Backend: selected API-surface excerpt
- Shared schemas: run-request and board-payload JSON schemas
- Fixtures: sanitized demo brief, sources, and board payload
- Tests / validation: publication audit script plus source material references
- Documentation: architecture, roadmap, scope, MiMo API usage, publication checklist, summary

## Sensitive files found in the original working repository
- real local env files;
- internal planning workspace files;
- logs and operational traces;
- deployment-oriented materials with live infra details.

## Files that must not be published from the original repo
- `.env*` except sanitized examples
- `.sisyphus/`
- `logs/`
- local build caches
- private deployment notes and operational traces

## Recommended public structure
- docs-first public showcase layer
- sanitized fixtures
- shared contracts
- selected safe code excerpts
- explicit WIP framing

## Open questions / risks
- final license choice still pending
- screenshot assets should be replaced with final approved visuals before public submission
- if a fully runnable public repo is ever required, a separate dependency-safe packaging pass will still be needed
