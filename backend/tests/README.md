# Backend Tests

The original private working project contains a broader backend test surface covering:
- health and route contracts
- SSE behavior
- fixture/fallback behavior
- live-path truthfulness boundaries
- source policy and label hygiene

This showcase repo does not mirror the full private test suite. Instead, it provides:
- publication-safety verification via `scripts/audit_publication_readiness.py`
- contract examples via `shared/`
- public-safe backend API excerpts.
