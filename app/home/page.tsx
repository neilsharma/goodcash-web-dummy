import WebAppLayout from "@/components/WebAppLayout";
import { EScreenEventTitle } from "../../utils/types";
import { trackPage } from "../../utils/analytics/analytics";

export default function HomePage() {
  trackPage(EScreenEventTitle.WEB_APP_HOME);

  return (
    <WebAppLayout>
      <div className="flex flex-col gap-4 items-center">
        <h1 className="font-kansasNewSemiBold text-primary text-4xl font-semibold text-center">
          Application Home Page
        </h1>
      </div>
    </WebAppLayout>
  );
}
