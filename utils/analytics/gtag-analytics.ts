import { gtagId } from "@/shared/config";
import { AnalyticsEventProperties } from "../types";

export enum ConversionEvent {
  BankAccountLinked = "YBN7CMn9_sAYEKm7srMp",
  BankAccountConnected = "DjYeCO-u37oYEKm7srMp",
  OnboardingCompleted = "pP3rCLvwn6sYEKm7srMp",
}

export const trackGTagConversion = (
  event: ConversionEvent,
  properties?: AnalyticsEventProperties
) => {
  if (!window.gtag) {
    return;
  }

  window.gtag?.("event", "conversion", {
    send_to: `${gtagId}/${event}`,
    transaction_id: "",
    ...(properties && properties),
  });
};

export const setGtagUserId = (userId: string) => {
  if (!window.gtag) {
    return;
  }

  window.gtag?.("set", "user_properties", {
    user_id: userId,
  });
};

export const getGtagSessionData = async () => {
  if (!window?.gtag) {
    return null;
  }

  const gclidPromise = new Promise<string>((resolve) => {
    window.gtag?.("get", gtagId, "gclid", resolve);
  });

  const sessionIdPromise = new Promise<string>((resolve) => {
    window.gtag?.("get", gtagId, "session_id", resolve);
  });

  const sessionNumberPromise = new Promise<string>((resolve) => {
    window.gtag?.("get", gtagId, "session_number", resolve);
  });

  const clientIdPromise = new Promise<string>((resolve) => {
    window.gtag?.("get", gtagId, "client_id", resolve);
  });

  const sessionData = await Promise.all([
    gclidPromise,
    sessionIdPromise,
    sessionNumberPromise,
    clientIdPromise,
  ]);

  return {
    gclid: sessionData[0],
    sessionId: sessionData[1],
    sessionNumber: sessionData[2],
    clientId: sessionData[3],
  };
};
