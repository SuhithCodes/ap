# AI Layer (Planned)

This repo does not yet include an AI service. This document defines the intended behavior and boundaries so the UI and AI can be implemented independently.

## Responsibilities

## Intent Parser

Input: user text (+ optional UI context)

Output:

- metric (e.g. 4-year graduation rate)
- timeframe (e.g. last 5 years)
- breakdown (e.g. by gender)
- filters (e.g. Female, 2023)
- requested action (trend / compare / explain / export summary)

## Chart Selector

Given a normalized intent + available data series, chooses:

- chart type (line, grouped bar, etc.)
- encodings (x/y/series)
- highlighting rules (anomalies, selected bars)

## Insight Generator

Produces:

- plain-language insights (what changed, when, and magnitude)
- short rationale (“why this chart”)
- citations to the data currently shown in the visualization panel

## State Memory

Maintains a session analysis state so follow-ups do not require re-asking:

- metric/timeframe persist by default
- follow-ups modify dimensions/filters incrementally
- UI clicks become structured context events


