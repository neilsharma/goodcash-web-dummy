import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import Title from "@/components/Title";
import { onboardingStepToPageMap } from "@/shared/constants";
import { useOnboarding } from "@/shared/context/onboarding";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import { completeUserOnboarding, patchUserOnboarding } from "@/shared/http/services/user";
import { ConversionEvent, trackGTagConversion } from "@/utils/analytics/gtag-analytics";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import useTrackPage from "../../shared/hooks/useTrackPage";
import { trackEvent } from "../../utils/analytics/analytics";
import { EScreenEventTitle, ETrackEvent } from "../../utils/types";

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

        trackGTagConversion(ConversionEvent.OnboardingCompleted);

        if (howDidYouHearAboutUs)
          trackEvent({
            event: ETrackEvent.USER_HERD_ABOUT_US,
            options: { from: howDidYouHearAboutUs },
          });

        setOnboardingStep("NEW_CARD_ON_THE_WAY");
        setOnboardingOperationsMap((p) => ({ ...p, onboardingCompleted: true }));
        patchUserOnboarding({
          onboardingStep: "NEW_CARD_ON_THE_WAY",
          onboardingOperationsMap: { onboardingCompleted: true },
          howDidYouHearAboutUs,
        });
      }

      push(onboardingStepToPageMap.NEW_CARD_ON_THE_WAY);
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
