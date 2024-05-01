import { redirect } from "next/navigation";
import { DashboardProvider } from "./dashboard-context";
import { NavHeader } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GCUser } from "@/shared/http/types";
import { GCUserState } from "@/utils/types";

// const { getUser } = new UserHttpService(appRouterServerSideHttpClient);

export default async function Layout({ children }: { children: React.ReactNode }) {
  try {
    // const gcUser = await getUser();
    const gcUser: GCUser = {
      id: "dummy_user_id",
      state: GCUserState.LIVE,
      firebaseUid: "dummy firebaseUid",
      lithicAccount: "dummy lithic account",
      createdAt: new Date(),
      updatedAt: new Date(),
      contactInfo: {
        phone: "(123) 456-7890",
        email: "dummy@email.com",
        addressLine1: "dummy address1",
        addressLine2: "dummy address 2",
        addressLine3: "dummy address 3",
        city: "San Cupertino",
        state: "CA",
        zip: "12312",
        country: "USA",
        firstName: "Super",
        lastName: "Man",
      },
    };

    // if (!gcUser) return redirect("/login");

    // const { errorCode } = checkUserState(gcUser.state);

    // if (errorCode === ESupportedErrorCodes.USER_ONBOARDING_INCOMPLETE)
    // return redirect("/onboarding");

    // if (errorCode) throw errorCode;

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
