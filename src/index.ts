export { ProjectionController } from './controller.js';
export { selectAudienceDisplay } from './display.js';
export {
  assertValidCues,
  createProjectionState,
  reduceProjectionState,
} from './state.js';
export type {
  CueKind,
  DisplayDescriptor,
  DisplaySelectionPolicy,
  DisplaySelectionReason,
  DisplaySelectionResult,
  OutputMode,
  ProjectionCue,
  ProjectionEvent,
  ProjectionListener,
  ProjectionOutput,
  ProjectionState,
} from './types.js';
