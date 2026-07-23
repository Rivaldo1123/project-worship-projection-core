import type {
  ProjectionCue,
  ProjectionEvent,
  ProjectionOutput,
  ProjectionState,
} from './types.js';

function clampIndex(index: number, cueCount: number): number {
  if (cueCount === 0) return -1;
  return Math.min(Math.max(index, 0), cueCount - 1);
}

function cueAt(cues: readonly ProjectionCue[], index: number): ProjectionCue | null {
  return index >= 0 && index < cues.length ? (cues[index] ?? null) : null;
}

function deriveState(
  cues: readonly ProjectionCue[],
  currentIndex: number,
  output: ProjectionOutput,
  revision: number,
): ProjectionState {
  const currentCue = cueAt(cues, currentIndex);
  const audienceCue = output.mode === 'freeze' ? output.frozenCue : output.mode === 'live' ? currentCue : null;

  return Object.freeze({
    cues: Object.freeze([...cues]),
    currentIndex,
    output: Object.freeze(output),
    revision,
    currentCue,
    previousCue: cueAt(cues, currentIndex - 1),
    nextCue: cueAt(cues, currentIndex + 1),
    audienceCue,
  });
}

export function assertValidCues(cues: readonly ProjectionCue[]): void {
  const ids = new Set<string>();

  for (const cue of cues) {
    if (!cue || typeof cue !== 'object') throw new TypeError('Every cue must be an object.');
    if (typeof cue.id !== 'string' || cue.id.trim() === '') throw new TypeError('Every cue requires a non-empty id.');
    if (ids.has(cue.id)) throw new Error(`Duplicate cue id: ${cue.id}`);
    ids.add(cue.id);

    if (!['text', 'image', 'video', 'timer', 'custom'].includes(cue.kind)) {
      throw new TypeError(`Unsupported cue kind: ${String(cue.kind)}`);
    }
  }
}

export function createProjectionState(
  cues: readonly ProjectionCue[] = [],
  startIndex = 0,
): ProjectionState {
  assertValidCues(cues);
  const currentIndex = clampIndex(startIndex, cues.length);
  return deriveState(cues, currentIndex, { mode: 'idle', frozenCue: null }, 0);
}

export function reduceProjectionState(
  state: ProjectionState,
  event: ProjectionEvent,
): ProjectionState {
  let cues = state.cues;
  let currentIndex = state.currentIndex;
  let output = state.output;

  switch (event.type) {
    case 'LOAD_CUES': {
      assertValidCues(event.cues);
      cues = event.cues;
      currentIndex = clampIndex(event.startIndex ?? 0, cues.length);
      output = { mode: 'idle', frozenCue: null };
      break;
    }
    case 'NEXT':
      currentIndex = clampIndex(currentIndex + 1, cues.length);
      break;
    case 'PREVIOUS':
      currentIndex = clampIndex(currentIndex - 1, cues.length);
      break;
    case 'JUMP_TO': {
      const targetIndex = cues.findIndex((cue) => cue.id === event.cueId);
      if (targetIndex === -1) throw new Error(`Cue not found: ${event.cueId}`);
      currentIndex = targetIndex;
      break;
    }
    case 'GO_LIVE':
      output = { mode: 'live', frozenCue: null };
      break;
    case 'BLACK':
      output = { mode: 'black', frozenCue: null };
      break;
    case 'SHOW_LOGO':
      output = { mode: 'logo', frozenCue: null };
      break;
    case 'FREEZE':
      if (output.mode !== 'freeze') {
        output = { mode: 'freeze', frozenCue: state.audienceCue ?? state.currentCue };
      }
      break;
    case 'UNFREEZE':
      output = { mode: 'live', frozenCue: null };
      break;
    case 'RESET':
      currentIndex = cues.length > 0 ? 0 : -1;
      output = { mode: 'idle', frozenCue: null };
      break;
    default: {
      const exhaustive: never = event;
      return exhaustive;
    }
  }

  return deriveState(cues, currentIndex, output, state.revision + 1);
}
