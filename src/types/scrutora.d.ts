export {};

declare global {
  interface ScrutoraConsentStates {
    essential: boolean;
    analytics?: boolean;
    marketing?: boolean;
    ai_processing?: boolean;
    [key: string]: boolean | undefined;
  }

  interface ScrutoraConsentRecord {
    states: ScrutoraConsentStates;
    timestamp: string;
    receiptId: string;
  }

  interface ScrutoraConsentAPI {
    getConsent(): ScrutoraConsentRecord | null;
    openPreferences(): void;
    onConsentChange(callback: (states: ScrutoraConsentStates) => void): void;
  }

  interface Window {
    ScrutoraConsent?: ScrutoraConsentAPI;
    dataLayer?: Record<string, unknown>[];
  }
}
