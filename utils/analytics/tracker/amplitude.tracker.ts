import { ETrackEvent, IGCAnalyticsData, UserProperties } from "../../types";
import { track, identify, Identify, setUserId, init } from "@amplitude/analytics-browser";
import { AbstractEventTracker } from "../abstract-event-tracker";
import { IGCUser } from "../../types";

export class AmplitudeAnalyticsTracker extends AbstractEventTracker {
  private static instance: AmplitudeAnalyticsTracker;

  private constructor() {
    super();
    if (process.env.NEXT_PUBLIC_APMLITUDE_API_KEY) {
      init(process.env.NEXT_PUBLIC_APMLITUDE_API_KEY);
    }
  }

  static getInstance(): AmplitudeAnalyticsTracker {
    if (!AmplitudeAnalyticsTracker.instance) {
      AmplitudeAnalyticsTracker.instance = new AmplitudeAnalyticsTracker();
    }

    return AmplitudeAnalyticsTracker.instance;
  }

  logEvent(event: ETrackEvent, options?: IGCAnalyticsData | undefined): void {
    track(event, options);
  }

  setUserProperties(properties: UserProperties): void {
    const identifyObj = new Identify();
    if (properties && typeof properties === "object") {
      for (const property in properties) {
        identifyObj.set(property, properties[property]);
      }
    }
    identify(identifyObj);
  }

  setUser(user: Partial<IGCUser>): void {
    setUserId(user.id || undefined);
  }
}
