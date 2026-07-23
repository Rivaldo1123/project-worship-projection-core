# Project Worship Projection Core

A framework-independent TypeScript state engine for dependable worship, presentation, and live-event projection.

The library separates projection decisions from UI frameworks and desktop shells. It provides deterministic cue navigation, output safety states, display-selection policy, immutable state transitions, and an event-driven controller that can be embedded in Electron, Tauri, web, or native-hosted applications.

## Why this exists

Volunteer-led churches and community organizations often need projection software that remains predictable under pressure, works without a network connection, and behaves safely when a display is disconnected or content changes unexpectedly. This project extracts the reusable projection concepts developed while building Project Worship into a public library that other developers can adopt and improve.

## Features

- Deterministic current/next/previous cue navigation
- Jump-to-cue and service-plan replacement
- Black, freeze, logo, and live output modes
- Frozen-frame semantics that preserve the last visible cue
- Dual-display selection with explicit preference and safe fallback
- Pure reducer API for easy testing and state persistence
- Event-driven `ProjectionController` for application integration
- Runtime validation for untrusted service-plan input
- No Electron, React, database, cloud, or church-vendor dependency

## Install

```bash
npm install @project-worship/projection-core
```

Until the first npm release, install from GitHub or clone the repository.

```bash
git clone https://github.com/Rivaldo1123/project-worship-projection-core.git
cd project-worship-projection-core
npm install
npm test
```

## Quick start

```ts
import {
  ProjectionController,
  createProjectionState,
  type ProjectionCue,
} from '@project-worship/projection-core';

const cues: ProjectionCue[] = [
  { id: 'welcome', kind: 'text', content: { text: 'Welcome' } },
  { id: 'song-v1', kind: 'text', content: { text: 'Verse 1' } },
  { id: 'song-c', kind: 'text', content: { text: 'Chorus' } },
];

const controller = new ProjectionController(createProjectionState(cues));

controller.subscribe((state, event) => {
  console.log(event.type, state.output.mode, state.currentCue?.id);
});

controller.dispatch({ type: 'GO_LIVE' });
controller.dispatch({ type: 'NEXT' });
controller.dispatch({ type: 'FREEZE' });
controller.dispatch({ type: 'NEXT' }); // navigation changes, frozen output remains stable
controller.dispatch({ type: 'UNFREEZE' });
```

## Core model

The engine distinguishes between the operator's navigation position and what the audience sees. This is essential for reliable live operation:

- **Live:** audience follows the selected cue.
- **Black:** audience receives an intentionally blank output.
- **Logo:** audience receives an application-provided logo surface.
- **Freeze:** audience keeps the cue that was visible when freeze was activated, while the operator may navigate elsewhere.

The library returns state descriptions; the host application decides how to render text, media, scripture, timers, or custom content.

## Display policy

```ts
import { selectAudienceDisplay } from '@project-worship/projection-core';

const selection = selectAudienceDisplay(displays, {
  operatorDisplayId: 'internal',
  preferredAudienceDisplayId: 'projector',
  allowSingleDisplayFallback: true,
});
```

The result explains whether a preferred, secondary, or fallback display was selected, allowing the host to show honest warnings instead of silently projecting to an unsafe destination.

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

## Project status

The API is in early public development. The initial release focuses on a small, stable, well-tested state engine. See [ROADMAP.md](ROADMAP.md) for planned work.

## Relationship to Project Worship

This repository is an independent open-source library extracted from general projection concepts developed for the private Project Worship desktop application. It intentionally contains no private application source, credentials, church data, activation logic, commercial administration code, or proprietary assets.

## Contributing

Contributions from church-tech developers, presentation-software maintainers, accessibility specialists, live-production volunteers, and TypeScript developers are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

MIT © Rivaldo Lewis / Valdo Enterprises
