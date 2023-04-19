import { ETrackEvent, FirebaseUserProperties, IGCAnalyticsData } from "../../types";
import { logEvent, setUserProperties, setUserId, Analytics } from "firebase/analytics";
import { AbstractEventTracker } from "../abstract-event-tracker";
import { IGCUser } from "../../types";
import { FirebaseApp } from "firebase/app";

export class FirebaseAnalyticsTracker extends AbstractEventTracker {
  private static instance: FirebaseAnalyticsTracker;
  private static analytics: Analytics;

  static getInstance(analyticsInstance: Analytics): FirebaseAnalyticsTracker {
    if (!FirebaseAnalyticsTracker.instance) {
      FirebaseAnalyticsTracker.instance = new FirebaseAnalyticsTracker();
    }
    FirebaseAnalyticsTracker.analytics = analyticsInstance;
    return FirebaseAnalyticsTracker.instance;
  }

  logEvent(event: ETrackEvent, options?: IGCAnalyticsData | undefined): void {
    logEvent(FirebaseAnalyticsTracker.analytics, event, options);
  }
  setUserProperties(properties: FirebaseUserProperties): void {
    setUserProperties(FirebaseAnalyticsTracker.analytics, properties);
  }
  setUser(user: Partial<IGCUser>): void {
    setUserId(FirebaseAnalyticsTracker.analytics, user.id ? user.id : null);
  }
}
