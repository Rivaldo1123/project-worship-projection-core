# Contributing

Thank you for helping improve Project Worship Projection Core.

## Principles

Changes should keep the library framework-independent, deterministic, offline-capable, and safe for live operation. Avoid dependencies on a specific UI toolkit, database, cloud provider, denomination, or commercial product.

## Workflow

1. Open an issue before substantial API changes.
2. Fork the repository and create a focused branch.
3. Add or update tests for every behavior change.
4. Run `npm run check` locally.
5. Submit a pull request explaining the user problem, design choice, and compatibility impact.

## Code expectations

- Use strict TypeScript.
- Prefer pure functions for state transitions.
- Keep public APIs small and documented.
- Do not silently recover from unsafe display selection.
- Treat identifiers and imported plans as untrusted input.
- Preserve backward compatibility unless the change is clearly documented.

## Commit messages

Use concise imperative messages, for example:

- `Add timer cue lifecycle`
- `Prevent unsafe display fallback`
- `Document Electron adapter pattern`

## Private or sensitive material

Never submit credentials, church data, copyrighted song lyrics, licensed Bible text, private Project Worship source code, internal product documentation, or proprietary assets.

## Conduct

Participation is governed by the [Code of Conduct](CODE_OF_CONDUCT.md).
