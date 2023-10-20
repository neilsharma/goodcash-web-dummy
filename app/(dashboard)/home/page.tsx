import { EScreenEventTitle } from "../../../utils/types";
import { trackPage } from "../../../utils/analytics/analytics";
import { UserName } from "./UserName";

export default async function HomePage() {
  trackPage(EScreenEventTitle.WEB_APP_HOME);

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="font-kansasNewSemiBold text-primary text-4xl font-semibold text-center">
        <UserName /> Home Page
      </h1>
    </div>
  );
}
