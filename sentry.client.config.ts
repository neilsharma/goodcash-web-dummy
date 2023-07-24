import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env["NEXT_PUBLIC_SENTRY_DSN"],
  debug: false,
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
