import { reduceProjectionState } from './state.js';
import type {
  ProjectionEvent,
  ProjectionListener,
  ProjectionState,
} from './types.js';

export class ProjectionController {
  #state: ProjectionState;
  readonly #listeners = new Set<ProjectionListener>();

  public constructor(initialState: ProjectionState) {
    this.#state = initialState;
  }

  public get state(): ProjectionState {
    return this.#state;
  }

  public dispatch(event: ProjectionEvent): ProjectionState {
    const previousState = this.#state;
    const nextState = reduceProjectionState(previousState, event);
    this.#state = nextState;

    for (const listener of this.#listeners) {
      listener(nextState, event, previousState);
    }

    return nextState;
  }

  public subscribe(listener: ProjectionListener): () => void {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }

  public clearListeners(): void {
    this.#listeners.clear();
  }
}
