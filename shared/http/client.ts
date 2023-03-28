import axios from "axios";
import { domain } from "../config";
import { getComputedAuth } from "../context/global";
import { urlPaths } from "./util";

export const http = axios.create({
  baseURL: domain,
  timeout: 10_000,
});

http.interceptors.request.use(async (config) => {
  if (config.url?.endsWith(urlPaths.USER_ME_CREATE)) return config;

  const controller = new AbortController();
  const auth = getComputedAuth();
  const token = await auth?.currentUser?.getIdToken();

  if (!auth?.currentUser || !token) controller.abort();

  config.headers = config.headers ?? {};
  config.headers["goodcash-authorization"] ??= token;

  return { ...config, signal: controller.signal };
});

export default http;
