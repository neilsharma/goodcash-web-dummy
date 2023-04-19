import { ETrackEvent, IGCAnalyticsData, UserProperties } from "../types";
import { IGCUser } from "../types";

export abstract class AbstractEventTracker {
  abstract logEvent(event: ETrackEvent, options?: IGCAnalyticsData): void | Promise<void>;
  abstract setUserProperties(properties: UserProperties): void | Promise<void>;
  abstract setUser(user: Partial<IGCUser>): void | Promise<void>;
}
