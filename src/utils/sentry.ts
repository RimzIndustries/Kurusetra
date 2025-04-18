import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: import.meta.env.MODE,
  beforeSend(event) {
    // Filter out errors we don't want to track
    if (event.exception?.values?.[0]?.value?.includes('ChunkLoadError')) {
      return null;
    }
    return event;
  }
});

export const captureError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    contexts: {
      game: context
    }
  });
};

export const captureMessage = (message: string, level: Sentry.Severity = 'info') => {
  Sentry.captureMessage(message, level);
}; 