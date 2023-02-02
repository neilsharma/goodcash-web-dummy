import Image from "next/image";
import type { FC, ReactNode } from "react";

export const OnboardingLayout: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <div className="flex justify-center mt-8 mb-24">
        <Image
          src="/img/logo/goodcash.svg"
          alt="GoodCash"
          width={106}
          height={16}
        />
      </div>
      <main className="max-w-[500px] m-auto">{children}</main>
    </>
  );
};

export default OnboardingLayout;
