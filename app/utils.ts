import { NEXT_API_ROUTES } from "./constants";

export const userLogoutHandler = async () => {
  await fetch(NEXT_API_ROUTES.LOGOUT, { method: "POST" });
};
