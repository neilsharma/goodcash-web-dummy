import axios from "axios";

export const appRouterClientSideHttpClient = axios.create({ baseURL: "/api/proxy" });

export default appRouterClientSideHttpClient;
