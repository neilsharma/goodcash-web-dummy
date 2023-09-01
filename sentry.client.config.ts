import * as Sentry from "@sentry/nextjs";

Sentry.init({
  enabled: process.env["NEXT_PUBLIC_GOODCASH_ENVIRONMENT"] === "production",
  dsn: process.env["NEXT_PUBLIC_SENTRY_DSN"],
  debug: false,
  ignoreErrors: [
    "Non-Error promise rejection captured",
    // Ignore errors where 'null is not an object' is thrown when accessing a style property
    // (used to silence the style error from Firebase reCAPTCHA, non-breaking).
    /null is not an object \(evaluating '[A-Za-z]\.style'\)/i,
    // Ignore errors where 'Cannot read properties of null (reading 'style')' is thrown
    // (used to silence the style error from Firebase reCAPTCHA, non-breaking).
    "Cannot read properties of null (reading 'style')",
  ],

  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  tracePropagationTargets: [
    "localhost",
    /^\//,
    /goodcash-.*-goodcash.vercel.app/,
    /^https:\/\/goodcash-(sandbox|production)\.goodcashapis\.com/,
  ],
  tracesSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
});
