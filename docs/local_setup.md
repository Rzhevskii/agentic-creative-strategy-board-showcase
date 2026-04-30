# Local Setup

## Purpose
This public repository is a curated showcase layer with real demo-safe implementation slices, not the full private operational repo.

## Minimal local review

Run the publication-readiness audit:

```bash
python3 scripts/audit_publication_readiness.py
```

Optional backend test pass:

```bash
python3 -m pip install -r backend/requirements.txt
python3 -m pytest backend/tests -q
```

Optional frontend dependency install for code inspection and type tooling:

```bash
cd frontend
npm install
```

Optional lightweight doc preview:

```bash
python3 -m http.server 8000
```

Then open the repository root in a browser.

## What this repo does not do
- it does not include private deployment secrets;
- it does not include the full private cloud wiring;
- it does not promise a turnkey production run of the original contest system.
