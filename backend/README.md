# Backend Showcase Slice

This folder now contains a **real demo-safe backend slice**, not just a single API excerpt.

Included here:
- `app/main.py` with the public run-oriented API shape
- `app/models.py` with real request/response models
- `app/store.py` with in-memory run/session + SSE state
- `app/sse.py` with stream handling
- `app/fixtures.py` with deterministic fixture loading
- `app/orchestrator.py` with a bounded demo runner
- `tests/` with a small public-safe contract test surface

Intentionally excluded:
- cloud persistence
- live provider wiring
- deployment secrets
- private auth/access layers

This backend is meant to demonstrate the **bounded demo path** clearly and honestly.
