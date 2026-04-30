# Frontend Showcase Slice

This folder now contains a **real sanitized frontend slice** of the original board-first app.

Included here:
- `app/` routes for intake and run workspace
- `components/brief`, `components/progress`, `components/board`, `components/story`, `components/visual-blocks`, and `components/ui`
- `types/contracts.ts`
- `lib/api`, `lib/sse`, `lib/validation`, `lib/serializers`, and `lib/assets`

Excluded intentionally:
- protected access wiring
- judge/colleague auth flows
- server-to-server secret proxying
- hosting configuration
- private env and deployment details

The goal is to show a real WIP MVP render surface without exposing private operational layers.
