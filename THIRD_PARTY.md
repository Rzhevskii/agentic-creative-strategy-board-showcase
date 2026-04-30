# Third-Party and Platform Notes

## Intended model and platform stack
- Gemini / Google GenAI SDK for the original contest-oriented implementation path
- MiMo API as an additional model candidate for the same pipeline
- Optional comparison against GPT- and Claude-based runs

## Intended web extraction boundary
- bounded extraction over selected public URLs only
- no broad crawling as the primary product behavior
- citation-aware output rather than hidden summarization

## Intended infrastructure shape
- Next.js frontend
- FastAPI backend
- SSE progress transport
- Firebase App Hosting + Cloud Run deployment target
- Firestore + Cloud Storage for metadata and artifacts

## Public showcase note
This repository intentionally excludes private deployment wiring, secrets, logs, internal task artifacts, and operational traces.
