# Planned MiMo API Usage

## Goal
MiMo API is planned as an additional model candidate inside the same agentic creative-strategy pipeline.

## Intended usage areas
- long-horizon agentic reasoning;
- extraction normalization;
- creative strategy synthesis;
- evidence-vs-inference checking;
- cluster hygiene and deduplication;
- next-test brief generation;
- optional audio recap generation;
- model comparison against Gemini / GPT / Claude-based runs.

## Why MiMo fits this project
The system is not a single-shot chat prompt. It is a multi-stage workflow that benefits from:
- longer reasoning over bounded evidence sets;
- consistency in strategic synthesis;
- explicit separation between grounded observations and inferred recommendations.

## Public showcase note
This repo documents the intended MiMo integration path. It does not expose private credentials, live endpoints, or internal deployment wiring.
