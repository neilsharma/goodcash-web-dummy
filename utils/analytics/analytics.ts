import { Analytics } from "firebase/analytics";
import {
  EScreenEventTitle,
  ETrackEvent,
  FirebaseUserProperties,
  IGCAnalyticsData,
  ScreenTrackEvent,
  UserProperties,
} from "../types";
import { AmplitudeAnalyticsTracker } from "./tracker/amplitude.tracker";
import { FirebaseAnalyticsTracker } from "./tracker/firebase.tracker";

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

    amplitude?.logEvent(log.event, { platform: "web", ...log.options });
    firebase?.logEvent(trimmedLogEvent, { platform: "web", ...log.options });
  } catch (error) {
    console.error("Log error", error);
  }
};

export const setUserId = (id: string) => {
  firebase?.setUser({ id });
  amplitude?.setUser({ id });
};

export const setUserProperties = (properties: UserProperties | FirebaseUserProperties) => {
  firebase?.setUserProperties(properties as FirebaseUserProperties);
  amplitude?.setUserProperties(properties as UserProperties);
};

export const trackPage = (info: `${EScreenEventTitle}`) =>
  trackEvent({
    event: `${info} Viewed`,
  });
