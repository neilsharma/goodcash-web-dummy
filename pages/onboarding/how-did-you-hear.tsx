import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import Title from "@/components/Title";
import { redirectIfServerSideRendered, useConfirmUnload, useLastPageGuard } from "@/shared/hooks";
import { completeUserOnboarding } from "@/shared/http/services/user";

export default function OnboardingHowDidYouHearPage() {
  useConfirmUnload();
  const allowed = useLastPageGuard();
  const { push } = useRouter();
  const [selectedOption, setSelectedOption] = useState("");

  const finish = useCallback(async () => {
    await completeUserOnboarding();
    push("/onboarding/application-complete");
  }, [push]);

  if (!allowed) return <OnboardingLayout />;

  return (
    <OnboardingLayout>
      <Title>How did you hear about GoodCash?</Title>

      <div className="my-12">
        {options.map((op) => (
          <label key={op} className="flex gap-3 items-center my-6 cursor-pointer">
            <input
              name="how"
              type="radio"
              className="w-5 h-5"
              onChange={() => setSelectedOption(op)}
            />
            <p className="font-sharpGroteskBook text-boldText">{op}</p>
          </label>
        ))}
      </div>

      <div className="flex gap-4 mb-8">
        <Button disabled={!selectedOption} onClick={finish}>
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
