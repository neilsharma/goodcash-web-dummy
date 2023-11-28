import axios from "axios";
import { domain } from "../../config";
import { getComputedAuth, getComputedUserSession } from "../../context/global";
import { getUserInfoFromCache, urlPaths } from "../util";

export const pagesRouterHttpClient = axios.create({
  baseURL: domain,
  timeout: 30_000,
});

const unauthorizedRequests = [urlPaths.USER_ME_CREATE, urlPaths.LOAN_AGREEMENTS_COVERAGE];

pagesRouterHttpClient.interceptors.request.use(async (config) => {
  const analyticsHeaderValue = getAnalyticsHeaderValue();
  if (analyticsHeaderValue) {
    config.headers["goodcash-analytics"] = analyticsHeaderValue;
  }

  if (unauthorizedRequests.some((path) => config.url?.endsWith(path))) {
    return config;
  }

  const controller = new AbortController();
  const auth = getComputedAuth();
  const token = await auth?.currentUser?.getIdToken();

  const cachedUserInfo = getUserInfoFromCache();
  let cachedAuthToken: string | null = null;

  if (cachedUserInfo) {
    cachedAuthToken = cachedUserInfo.auth_token;
  }

  if ((!auth?.currentUser || !token) && !cachedAuthToken) {
    controller.abort();
  }

  config.headers = config.headers ?? {};
  config.headers["goodcash-authorization"] ??= token;
  config.headers["goodcash-authorization"] ??= cachedAuthToken;

  return { ...config, signal: controller.signal };
});

function getAnalyticsHeaderValue(): string | undefined {
  const userSession = getComputedUserSession();
  return userSession ? encodeURIComponent(JSON.stringify(userSession)) : undefined;
}

export default pagesRouterHttpClient;
