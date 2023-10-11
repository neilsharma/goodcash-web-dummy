import axios from "axios";
import { domain } from "../config";
import { getComputedAuth, getComputedUserSession } from "../context/global";
import { getUserInfoFromCache, urlPaths } from "./util";

export const http = axios.create({
  baseURL: domain,
  timeout: 30_000,
});

// List of URL paths that do not require authentication for making requests
const unauthorizedRequests = [urlPaths.USER_ME_CREATE, urlPaths.LOAN_AGREEMENTS_COVERAGE];

// Intercept requests and add authentication headers if necessary
http.interceptors.request.use(async (config) => {
  const analyticsHeaderValue = getAnalyticsHeaderValue();
  if (analyticsHeaderValue) {
    config.headers["goodcash-analytics"] = analyticsHeaderValue;
  }

  // Check if the request URL matches any of the unauthorized paths
  if (unauthorizedRequests.some((path) => config.url?.endsWith(path))) {
    return config; // Skip authentication for unauthorized requests
  }

  const controller = new AbortController();
  const auth = getComputedAuth();
  const token = await auth?.currentUser?.getIdToken();

  const cachedUserInfo = getUserInfoFromCache();
  let cachedAuthToken: string | null = null;

  if (cachedUserInfo) {
    cachedAuthToken = cachedUserInfo.auth_token;
  }

  // If there is no authenticated user or token, abort the request
  if ((!auth?.currentUser || !token) && !cachedAuthToken) {
    controller.abort();
  }

  // Add the authentication token to the request headers
  config.headers = config.headers ?? {};
  config.headers["goodcash-authorization"] ??= token;
  config.headers["goodcash-authorization"] ??= cachedAuthToken;

  // Include the signal from the AbortController in the request configuration
  return { ...config, signal: controller.signal };
});

function getAnalyticsHeaderValue(): string | undefined {
  const userSession = getComputedUserSession();
  return userSession ? encodeURIComponent(JSON.stringify(userSession)) : undefined;
}

export default http;
