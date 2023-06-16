import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import Title from "@/components/Title";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import { completeUserOnboarding, patchUserOnboarding } from "@/shared/http/services/user";
import { useOnboarding } from "@/shared/context/onboarding";
import { onboardingStepToPageMap } from "@/shared/constants";
import { trackEvent } from "../../utils/analytics/analytics";
import { EScreenEventTitle, ETrackEvent } from "../../utils/types";
import useTrackPage from "../../shared/hooks/useTrackPage";
import { gtagId } from "@/shared/config";

export default function OnboardingHowDidYouHearPage() {
  useConfirmUnload();

  useTrackPage(EScreenEventTitle.HOW_DID_YOU_HEAR);

  const {
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setOnboardingStep,
    howDidYouHearAboutUs,
    setHowDidYouHearAboutUs,
    redirectToGenericErrorPage,
  } = useOnboarding();
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const finish = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!onboardingOperationsMap.onboardingCompleted) {
        await completeUserOnboarding();

        window.gtag?.("event", "conversion", {
          send_to: `${gtagId}/pP3rCLvwn6sYEKm7srMp`,
          transaction_id: "",
        });

        if (howDidYouHearAboutUs)
          trackEvent({
            event: ETrackEvent.USER_HERD_ABOUT_US,
            options: { from: howDidYouHearAboutUs },
          });

        setOnboardingStep("THANKS_FOR_JOINING");
        setOnboardingOperationsMap((p) => ({ ...p, onboardingCompleted: true }));
        patchUserOnboarding({
          onboardingStep: "THANKS_FOR_JOINING",
          onboardingOperationsMap: { onboardingCompleted: true },
          howDidYouHearAboutUs,
        });
      }

      push(onboardingStepToPageMap.THANKS_FOR_JOINING);
    } catch (error) {
      redirectToGenericErrorPage();
    }
  }, [
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setIsLoading,
    setOnboardingStep,
    howDidYouHearAboutUs,
    push,
    redirectToGenericErrorPage,
  ]);

  return (
    <OnboardingLayout>
      <Title className="border-b-gray-200 border-b-[1px] m-0 pb-4">
        How did you hear about GoodCash?
      </Title>

      <div className="overflow-y-scroll h-[50vh]">
        <div>
          {options.map((op) => (
            <label key={op} className="flex gap-3 items-center my-6 cursor-pointer">
              <input
                name="how"
                type="radio"
                className="w-5 h-5"
                onChange={() => setHowDidYouHearAboutUs(op)}
              />
              <p className="font-sharpGroteskBook text-boldText">{op}</p>
            </label>
          ))}
        </div>
      </div>
      <div className="pt-8 bg-bgPrimary bottom-0 border-t-gray-200 border-t-[1px]">
        <Button onClick={finish} isLoading={isLoading}>
          Finish
        </Button>
      </div>
    </OnboardingLayout>
  );
}

const options = [
  "Youtube",
  "Instagram",
  "TikTok",
  "Snapchat",
  "A friend or family member",
  "Email",
  "Blog/Article",
  "Search (Google/Bing)",
  "Facebook",
  "Radio",
  "TV",
  "Word of mouth",
  "Podcast",
  "Banner on a website",
  "Other",
];

export const getServerSideProps = redirectIfServerSideRendered;
