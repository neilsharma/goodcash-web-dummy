import { Analytics } from "firebase/analytics";
import {
  EScreenEventTitle,
  ETrackEvent,
  FirebaseUserProperties,
  IGCAnalyticsData,
  ScreenTrackEvent,
  UserProperties,
} from "../types";
import { setGtagUserId } from "./gtag-analytics";
import * as Sentry from "@sentry/nextjs";
import { AmplitudeAnalyticsTracker } from "./tracker/amplitude.tracker";
import { FirebaseAnalyticsTracker } from "./tracker/firebase.tracker";
import Hotjar from "@hotjar/browser";

let firebase: FirebaseAnalyticsTracker;
let amplitude: AmplitudeAnalyticsTracker;

export const trackerInitializer = async (firebaseAnalyticsInstance: Analytics) => {
  firebase = FirebaseAnalyticsTracker.getInstance(firebaseAnalyticsInstance);
  amplitude = AmplitudeAnalyticsTracker.getInstance();
};

export const trackEvent = (log: {
  event: ETrackEvent | ScreenTrackEvent;
  options?: IGCAnalyticsData;
}) => {
  try {
    const trimmedLogEvent = log.event.substring(0, 40) as ETrackEvent;

    const eventOptions = { platform: "web", ...log.options };

    amplitude?.logEvent(log.event, eventOptions);
    firebase?.logEvent(trimmedLogEvent, eventOptions);
  } catch (error) {}
};

export const setUserId = (id: string) => {
  firebase?.setUser({ id });
  amplitude?.setUser({ id });
  Hotjar.identify(id, {});
  Sentry.setUser({ id });
  setGtagUserId(id);
};

export const setUserProperties = (properties: UserProperties | FirebaseUserProperties) => {
  firebase?.setUserProperties(properties as FirebaseUserProperties);
  amplitude?.setUserProperties(properties as UserProperties);
};

export const trackPage = (info: `${EScreenEventTitle}`, error_code?: string) =>
  trackEvent({
    event: `${info} Viewed`,
    ...(error_code
      ? {
          options: {
            error_code,
          },
        }
      : {}),
  });
