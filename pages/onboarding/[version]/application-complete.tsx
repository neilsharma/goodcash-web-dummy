import { useEffect } from "react";
import Image from "next/image";
import OnboardingLayout from "@/components/OnboardingLayout";
import { testFlightLink } from "@/shared/config";
import { EScreenEventTitle } from "../../../utils/types";
import useTrackPage from "../../../shared/hooks/useTrackPage";

export default function OnboardingApplicationCompletePage() {
  useTrackPage(EScreenEventTitle.APPLICATION_COMPLETE);
  useEffect(() => {
    let os = "Unknown OS";

    if (navigator.userAgent.indexOf("Win") != -1) os = "Windows";
    else if (navigator.userAgent.indexOf("Mac") != -1) os = "Mac";
    else if (navigator.userAgent.indexOf("Linux") != -1) os = "Linux";
    else if (navigator.userAgent.indexOf("Android") != -1) os = "Android";
    else if (navigator.userAgent.indexOf("like Mac") != -1) os = "iOS";

    if (os === "iOS") {
      window.location.href = testFlightLink;
    }
  }, []);

  return (
    <OnboardingLayout>
      <div className="flex flex-col gap-4 items-center">
        <Image
          src="/img/logo/check-circle.svg"
          alt="Success"
          width={120}
          height={120}
          priority={true}
        />
        <h1 className="font-kansasNewSemiBold text-primary text-4xl font-semibold text-center">
          Application Complete!
        </h1>
        <p className="font-sharpGroteskBook text-lg text-center">
          Download the GoodCash app to start using your virtual card right away and get your
          physical card.
        </p>
      </div>

      <div className="flex flex-col justify-center items-center gap-12 my-12 sm:flex-row">
        <a href="https://testflight.apple.com/join/dLPPHyYi">
          <Image src="/img/app-store.png" alt="app store" width={223} height={70} priority={true} />
        </a>
      </div>
    </OnboardingLayout>
  );
}
