import appRouterServerSideHttpClient from "@/shared/http/clients/app-router/server-side";
import { UserHttpService } from "@/shared/http/services/user";
import { checkUserState } from "@/utils/utils";
import { redirect } from "next/navigation";
import { DashboardProvider } from "./dashboard-context";
import { ESupportedErrorCodes } from "@/shared/error";

const { getUser } = new UserHttpService(appRouterServerSideHttpClient);

export default async function Layout({ children }: { children: React.ReactNode }) {
  try {
    const gcUser = await getUser();

    if (!gcUser) return redirect("/login");

    const { errorCode } = checkUserState(gcUser.state);

    if (errorCode === ESupportedErrorCodes.USER_ONBOARDING_INCOMPLETE)
      return redirect("/onboarding");

    if (errorCode) throw errorCode;

    return <DashboardProvider gcUser={gcUser}>{children}</DashboardProvider>;
  } catch {
    return redirect("/login");
  }
}
