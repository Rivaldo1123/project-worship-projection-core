export type CueKind = 'text' | 'image' | 'video' | 'timer' | 'custom';

export interface ProjectionCue<TContent = unknown> {
  readonly id: string;
  readonly kind: CueKind;
  readonly content: TContent;
  readonly label?: string;
  readonly metadata?: Readonly<Record<string, string | number | boolean | null>>;
}

export type OutputMode = 'idle' | 'live' | 'black' | 'logo' | 'freeze';

export interface ProjectionOutput {
  readonly mode: OutputMode;
  readonly frozenCue: ProjectionCue | null;
}

export interface ProjectionState {
  readonly cues: readonly ProjectionCue[];
  readonly currentIndex: number;
  readonly output: ProjectionOutput;
  readonly revision: number;
  readonly currentCue: ProjectionCue | null;
  readonly previousCue: ProjectionCue | null;
  readonly nextCue: ProjectionCue | null;
  readonly audienceCue: ProjectionCue | null;
}

export type ProjectionEvent =
  | { readonly type: 'LOAD_CUES'; readonly cues: readonly ProjectionCue[]; readonly startIndex?: number }
  | { readonly type: 'NEXT' }
  | { readonly type: 'PREVIOUS' }
  | { readonly type: 'JUMP_TO'; readonly cueId: string }
  | { readonly type: 'GO_LIVE' }
  | { readonly type: 'BLACK' }
  | { readonly type: 'SHOW_LOGO' }
  | { readonly type: 'FREEZE' }
  | { readonly type: 'UNFREEZE' }
  | { readonly type: 'RESET' };

export interface DisplayDescriptor {
  readonly id: string;
  readonly label?: string;
  readonly primary: boolean;
  readonly internal?: boolean;
  readonly bounds: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
}

export interface DisplaySelectionPolicy {
  readonly operatorDisplayId?: string;
  readonly preferredAudienceDisplayId?: string;
  readonly allowSingleDisplayFallback?: boolean;
}

export type DisplaySelectionReason =
  | 'preferred-display'
  | 'secondary-display'
  | 'single-display-fallback'
  | 'no-safe-display';

export interface DisplaySelectionResult {
  readonly display: DisplayDescriptor | null;
  readonly reason: DisplaySelectionReason;
  readonly warning: string | null;
}

export type ProjectionListener = (
  state: ProjectionState,
  event: ProjectionEvent,
  previousState: ProjectionState,
) => void;
