import { FC, ReactNode, useMemo } from "react";
import Head from "next/head";
import Image from "next/image";
import { useOnboarding } from "@/shared/context/onboarding";
import { useServerSideOnboardingGuard } from "@/shared/hooks";

export const OnboardingLayout: FC<{ children?: ReactNode; skipGuard?: boolean }> = ({
  children,
  skipGuard = false,
}) => {
  const { onboardingStep } = useOnboarding();
  const allowed = useServerSideOnboardingGuard(skipGuard);

  const progress = useMemo(() => {
    switch (onboardingStep) {
      case "WELCOME":
        return 5;
      case "PHONE_VERIFICATION":
        return 10;
      case "PLAN_SELECTION_AND_USER_CREATION":
        return 25;
      case "CONTACT_INFO":
        return 40;
      case "BANK_ACCOUNT_CONNECTION":
        return 60;
      case "FINALIZING_APPLICATION":
        return 70;
      case "DOC_GENERATION":
        return 80;
      case "REFERRAL_SOURCE":
        return 90;
      case "APPLICATION_COMPLETE":
        return 100;
    }
  }, [onboardingStep]);

  return (
    <>
      <Head>
        <title>GoodCash Onboarding</title>
      </Head>
      <header className="flex justify-center mt-8 mb-[7vh]">
        <div
          className="fixed top-0 left-0 h-1 bg-primary transition-all ease-in duration-500"
          style={{ width: `${progress}vw` }}
        />
        <Image
          src="/img/logo/goodcash.svg"
          alt="GoodCash"
          width={106}
          height={16}
          priority={true}
        />
      </header>
      <main className="max-w-[500px] px-6 box-content m-auto">
        {!allowed && !skipGuard ? null : children}
      </main>
      <footer className="mx-auto mt-auto pt-12 pb-8 px-4 max-w-4xl text-center font-sharpGroteskBook">
        <p className="text-xs mb-6">
          © Copyright {new Date().getFullYear()} GoodCash, Inc. All rights reserved.
        </p>
        <p className="text-xs text-thinText">
          GoodCash is not a Bank. Banking services are provided by our partner Bank, Member FDIC.
          The GoodCash Card is issued by our partner bank pursuant to a license from Mastercard® and
          may be used everywhere Mastercard® cards are accepted.
        </p>
      </footer>
    </>
  );
};

export default OnboardingLayout;
