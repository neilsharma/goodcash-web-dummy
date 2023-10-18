import Image from "next/image";
import { FC, ReactNode } from "react";

export const WebAppLayout: FC<{
  children?: ReactNode;
  skipGuard?: boolean;
  pageTitle?: string;
}> = ({ children }) => {
  return (
    <>
      <header className="flex justify-center mt-8 mb-[7vh]">
        <Image
          src="/img/logo/goodcash.svg"
          alt="GoodCash"
          width={106}
          height={16}
          priority={true}
        />
      </header>
      <main className="max-w-[500px] px-6 box-content m-auto h-auto">{children}</main>
      <footer className="mx-auto mt-auto pt-12 pb-8 px-4 max-w-4xl text-center font-sharpGroteskBook">
        <p className="text-xs mb-6">
          © Copyright {new Date().getFullYear()} GoodCash, Inc. All rights reserved.
        </p>
        <p className="text-xs text-thinText">
          GoodCash is not a Bank. Banking services are provided by our partner Bank, Member FDIC.
          The GoodCash Card is issued by our partner bank pursuant to a license from Mastercard®
          and may be used everywhere Mastercard® cards are accepted.
        </p>
      </footer>
    </>
  );
};

export default WebAppLayout;
