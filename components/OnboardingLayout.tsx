import type { FC, ReactNode } from "react";
import Head from "next/head";
import Image from "next/image";

export const OnboardingLayout: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <>
      <Head>
        <title>GoodCash App Onboarding</title>
      </Head>
      <div className="flex justify-center mt-8 mb-24">
        <Image
          src="/img/logo/goodcash.svg"
          alt="GoodCash"
          width={106}
          height={16}
          priority={true}
        />
      </div>
      <main className="max-w-[500px] m-auto">{children}</main>
    </>
  );
};

export default OnboardingLayout;
