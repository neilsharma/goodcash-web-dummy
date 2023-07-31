import { getBaseUrl, goodcashEnvironment } from "@/shared/config";
import { Identify, identify, init, setUserId, track } from "@amplitude/analytics-browser";
import {
  ETrackEvent,
  IGCAnalyticsData,
  IGCUser,
  ScreenTrackEvent,
  UserProperties,
} from "../../types";
import { AbstractEventTracker } from "../abstract-event-tracker";
import { getUserInfoFromCache } from "../../../shared/http/util";

export class AmplitudeAnalyticsTracker extends AbstractEventTracker {
  private static instance: AmplitudeAnalyticsTracker;

  private constructor() {
    super();
    this.initAmplitude();
  }

  private initAmplitude(): void {
    if (!process.env.NEXT_PUBLIC_APMLITUDE_API_KEY) {
      return;
    }
    if (goodcashEnvironment !== "production") {
      init(process.env.NEXT_PUBLIC_APMLITUDE_API_KEY);
      return;
    }

    const cachedUserInfo = getUserInfoFromCache();

    init(process.env.NEXT_PUBLIC_APMLITUDE_API_KEY, cachedUserInfo?.userId || undefined, {
      serverUrl: `${getBaseUrl()}/events`,
    });
  }

  static getInstance(): AmplitudeAnalyticsTracker {
    if (!AmplitudeAnalyticsTracker.instance) {
      AmplitudeAnalyticsTracker.instance = new AmplitudeAnalyticsTracker();
    }

    return AmplitudeAnalyticsTracker.instance;
  }

  logEvent(event: ETrackEvent | ScreenTrackEvent, options?: IGCAnalyticsData | undefined): void {
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
