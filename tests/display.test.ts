import { describe, expect, it } from 'vitest';
import { selectAudienceDisplay, type DisplayDescriptor } from '../src/index.js';

const displays: DisplayDescriptor[] = [
  {
    id: 'internal',
    label: 'Laptop',
    primary: true,
    internal: true,
    bounds: { x: 0, y: 0, width: 1920, height: 1080 },
  },
  {
    id: 'projector',
    label: 'Projector',
    primary: false,
    bounds: { x: 1920, y: 0, width: 1920, height: 1080 },
  },
];

describe('display selection', () => {
  it('honours a safe preferred audience display', () => {
    const result = selectAudienceDisplay(displays, {
      operatorDisplayId: 'internal',
      preferredAudienceDisplayId: 'projector',
    });

    expect(result.display?.id).toBe('projector');
    expect(result.reason).toBe('preferred-display');
    expect(result.warning).toBeNull();
  });

  it('selects another display when preference is unavailable', () => {
    const result = selectAudienceDisplay(displays, {
      operatorDisplayId: 'internal',
      preferredAudienceDisplayId: 'missing',
    });

    expect(result.display?.id).toBe('projector');
    expect(result.reason).toBe('secondary-display');
  });

  it('refuses an unsafe single-display setup by default', () => {
    const result = selectAudienceDisplay([displays[0]!], {
      operatorDisplayId: 'internal',
    });

    expect(result.display).toBeNull();
    expect(result.reason).toBe('no-safe-display');
  });

  it('returns an explicit warning when fallback is enabled', () => {
    const result = selectAudienceDisplay([displays[0]!], {
      operatorDisplayId: 'internal',
      allowSingleDisplayFallback: true,
    });

    expect(result.display?.id).toBe('internal');
    expect(result.reason).toBe('single-display-fallback');
    expect(result.warning).toContain('operator display');
  });
});
