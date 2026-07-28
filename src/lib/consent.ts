// Scrutora consent helper — all callers use these instead of touching window.ScrutoraConsent directly.
// Fails open (returns true) when the Scrutora script isn't loaded (e.g. placeholder key in dev).

export type ConsentPurpose = 'analytics' | 'marketing' | 'ai_processing';

function getConsentRecord(): ScrutoraConsentRecord | null {
  if (typeof window === 'undefined' || !window.ScrutoraConsent) return null;
  return window.ScrutoraConsent.getConsent();
}

export function getConsentStates(): Record<string, boolean> {
  const record = getConsentRecord();
  if (!record?.states) return {};
  return Object.fromEntries(
    Object.entries(record.states).map(([key, value]) => [key, Boolean(value)])
  );
}

export function hasConsent(purpose: ConsentPurpose): boolean {
  const record = getConsentRecord();
  if (!record) return true; // fail open when Scrutora is not loaded
  if (!record.states) return false;
  return Boolean(record.states[purpose] ?? false);
}

export function isScrutoraLoaded(): boolean {
  return typeof window !== 'undefined'
    && !!window.ScrutoraConsent
    && typeof window.ScrutoraConsent.getConsent === 'function';
}

export function openConsentPreferences(): void {
  window.ScrutoraConsent?.openPreferences?.();
}

export function onConsentChange(callback: (states: ScrutoraConsentStates) => void): void {
  window.ScrutoraConsent?.onConsentChange?.(callback);
}

export function initializeConsentGatedTags(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const activateBlockedTags = () => {
    const states = getConsentStates();
    const blockedScripts = Array.from(document.querySelectorAll<HTMLScriptElement>('script[data-sc-category]'));

    blockedScripts.forEach((script) => {
      const category = script.getAttribute('data-sc-category');
      const isBlocked = script.type === 'text/plain';
      if (!isBlocked) return;

      const granted = category ? Boolean(states[category]) : true;
      if (!granted) return;

      const src = script.getAttribute('data-src');
      const newScript = document.createElement('script');

      if (src) {
        newScript.src = src;
        newScript.async = true;
      } else {
        newScript.textContent = script.textContent ?? '';
      }

      script.parentNode?.replaceChild(newScript, script);
    });
  };

  activateBlockedTags();

  window.ScrutoraConsent?.onConsentChange?.(() => {
    activateBlockedTags();
  });
}
