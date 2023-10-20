import axios from "axios";
import { cookies } from "next/headers";
import { domain } from "../../../config";
import { TOKEN_KEY } from "@/app/constants";

export const appRouterServerSideHttpClient = axios.create({ baseURL: domain });

appRouterServerSideHttpClient.interceptors.request.use((config) => {
  const cookieStorage = cookies();
  const token = cookieStorage.get(TOKEN_KEY);

  config.headers["goodcash-authorization"] = token?.value;

  return config;
});

export default appRouterServerSideHttpClient;
