import appRouterServerSideHttpClient from "@/shared/http/clients/app-router/server-side";
import { UserHttpService } from "@/shared/http/services/user";
import { checkUserState } from "@/utils/utils";
import { redirect } from "next/navigation";
import { DashboardProvider } from "./dashboard-context";
import { ESupportedErrorCodes } from "@/shared/error";
import { NavHeader } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const { getUser } = new UserHttpService(appRouterServerSideHttpClient);

export default async function Layout({ children }: { children: React.ReactNode }) {
  try {
    const gcUser = await getUser();

    if (!gcUser) return redirect("/login");

    const { errorCode } = checkUserState(gcUser.state);

    if (errorCode === ESupportedErrorCodes.USER_ONBOARDING_INCOMPLETE)
      return redirect("/onboarding");

    if (errorCode) throw errorCode;

    return (
      <DashboardProvider gcUser={gcUser}>
        <div className="flex" style={{ minHeight: "100vh" }}>
          <NavHeader />
          <div className="flex flex-col mx-auto justify-between">
            <main className="px-6 my-8">{children}</main>
            <Footer />
          </div>
        </div>
      </DashboardProvider>
    );
  } catch {
    return redirect("/login");
  }
}
