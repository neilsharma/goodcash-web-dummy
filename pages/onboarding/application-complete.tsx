import OnboardingLayout from "@/components/OnboardingLayout";
import Image from "next/image";

export default function OnboardingApplicationCompletePage() {
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

      <div className="flex flex-col items-center gap-12 my-12 sm:flex-row">
        <Image src="/img/app-store.png" alt="app store" width={223} height={70} priority={true} />

        <Image
          src="/img/google-play.png"
          alt="google play"
          width={223}
          height={70}
          priority={true}
        />
      </div>
    </OnboardingLayout>
  );
}
