import type {
  DisplayDescriptor,
  DisplaySelectionPolicy,
  DisplaySelectionResult,
} from './types.js';

export function selectAudienceDisplay(
  displays: readonly DisplayDescriptor[],
  policy: DisplaySelectionPolicy = {},
): DisplaySelectionResult {
  if (displays.length === 0) {
    return {
      display: null,
      reason: 'no-safe-display',
      warning: 'No displays are available.',
    };
  }

  const preferred = policy.preferredAudienceDisplayId
    ? displays.find((display) => display.id === policy.preferredAudienceDisplayId)
    : undefined;

  if (preferred && preferred.id !== policy.operatorDisplayId) {
    return { display: preferred, reason: 'preferred-display', warning: null };
  }

  const secondary = displays.find((display) => display.id !== policy.operatorDisplayId);
  if (secondary) {
    return { display: secondary, reason: 'secondary-display', warning: null };
  }

  if (policy.allowSingleDisplayFallback === true) {
    return {
      display: displays[0] ?? null,
      reason: 'single-display-fallback',
      warning: 'Audience output is using the operator display because no secondary display is available.',
    };
  }

  return {
    display: null,
    reason: 'no-safe-display',
    warning: 'No safe audience display is available and single-display fallback is disabled.',
  };
}
