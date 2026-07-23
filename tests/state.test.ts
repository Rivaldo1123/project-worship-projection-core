import { describe, expect, it } from 'vitest';
import {
  createProjectionState,
  reduceProjectionState,
  type ProjectionCue,
} from '../src/index.js';

const cues: ProjectionCue[] = [
  { id: 'welcome', kind: 'text', content: { text: 'Welcome' } },
  { id: 'verse-1', kind: 'text', content: { text: 'Verse 1' } },
  { id: 'chorus', kind: 'text', content: { text: 'Chorus' } },
];

describe('projection state', () => {
  it('creates a deterministic initial state', () => {
    const state = createProjectionState(cues);

    expect(state.currentCue?.id).toBe('welcome');
    expect(state.previousCue).toBeNull();
    expect(state.nextCue?.id).toBe('verse-1');
    expect(state.output.mode).toBe('idle');
    expect(state.audienceCue).toBeNull();
  });

  it('navigates without passing plan boundaries', () => {
    let state = createProjectionState(cues);
    state = reduceProjectionState(state, { type: 'PREVIOUS' });
    expect(state.currentCue?.id).toBe('welcome');

    state = reduceProjectionState(state, { type: 'NEXT' });
    state = reduceProjectionState(state, { type: 'NEXT' });
    state = reduceProjectionState(state, { type: 'NEXT' });
    expect(state.currentCue?.id).toBe('chorus');
  });

  it('keeps the audience frame stable while frozen', () => {
    let state = createProjectionState(cues);
    state = reduceProjectionState(state, { type: 'GO_LIVE' });
    state = reduceProjectionState(state, { type: 'NEXT' });
    state = reduceProjectionState(state, { type: 'FREEZE' });

    expect(state.audienceCue?.id).toBe('verse-1');

    state = reduceProjectionState(state, { type: 'NEXT' });
    expect(state.currentCue?.id).toBe('chorus');
    expect(state.audienceCue?.id).toBe('verse-1');

    state = reduceProjectionState(state, { type: 'UNFREEZE' });
    expect(state.output.mode).toBe('live');
    expect(state.audienceCue?.id).toBe('chorus');
  });

  it('switches to safety output modes', () => {
    let state = createProjectionState(cues);
    state = reduceProjectionState(state, { type: 'GO_LIVE' });
    expect(state.audienceCue?.id).toBe('welcome');

    state = reduceProjectionState(state, { type: 'BLACK' });
    expect(state.output.mode).toBe('black');
    expect(state.audienceCue).toBeNull();

    state = reduceProjectionState(state, { type: 'SHOW_LOGO' });
    expect(state.output.mode).toBe('logo');
    expect(state.audienceCue).toBeNull();
  });

  it('rejects duplicate cue identifiers', () => {
    expect(() =>
      createProjectionState([
        { id: 'same', kind: 'text', content: 'one' },
        { id: 'same', kind: 'text', content: 'two' },
      ]),
    ).toThrow('Duplicate cue id');
  });

  it('throws when jumping to an unknown cue', () => {
    const state = createProjectionState(cues);
    expect(() => reduceProjectionState(state, { type: 'JUMP_TO', cueId: 'missing' })).toThrow(
      'Cue not found',
    );
  });
});
