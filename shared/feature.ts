import * as LdClient from "launchdarkly-js-client-sdk";
import { ldClientSideId } from "./config";

export enum EFeature {
  PLAID_UI_IDV = "plaid-ui-idv",
  DYNAMIC_SUBSCRIPTION_PLAN = "dynamic-subscription-plan",
  DYNAMIC_SUBSCRIPTION_PLAN_FUNDING_CARD = "dynamic-subscription-plan-funding-card",
}

let client: LdClient.LDClient;

export const init = async (userId: string, force = false) => {
  if (client && !force) return;

  client = LdClient.initialize(ldClientSideId, { kind: "user", key: userId });

  return client.waitForInitialization();
};

export const isFeatureEnabled = async <T = any>(
  userId: string,
  feature: EFeature,
  defaultValue?: T
): Promise<T> => {
  if (!client) await init(userId);

  return client.variation(feature, defaultValue);
};
