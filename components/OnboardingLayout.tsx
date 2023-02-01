import type { FC, ReactNode } from "react";

export const OnboardingLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <div className="flex justify-center mt-7 mb-24">
        <span className="font-kansasNewSemiBold text-xl">GoodCash</span>
      </div>
      <main className="max-w-screen-sm m-auto">{children}</main>
    </>
  );
};

export default OnboardingLayout;
