import { EScreenEventTitle } from "../../../utils/types";
import { trackPage } from "../../../utils/analytics/analytics";
import { Balance } from "./Balance";

export default async function HomePage() {
  trackPage(EScreenEventTitle.WEB_APP_HOME);

  return (
    <>
      <Balance />
    </>
  );
}
