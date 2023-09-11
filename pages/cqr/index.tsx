import React from "react";
import { goodcashEnvironment } from "../../shared/config";
import Image from "next/image";
import { EScreenEventTitle } from "../../utils/types";
import useTrackPage from "../../shared/hooks/useTrackPage";
import { appStoreAppUrl, playStoreAppUrl } from "../../shared/constants";

const CQRPage = () => {
  const appStoreUrlHandler = () => {
    setTimeout(() => {
      document.location.replace(appStoreAppUrl);
    }, 1500);
    downloadButtonHandler();
  };

  const playStoreUrlHandler = () => {
    setTimeout(() => {
      document.location.replace(playStoreAppUrl);
    }, 1500);
    downloadButtonHandler();
  };

  useTrackPage(EScreenEventTitle.CQR);

  const downloadButtonHandler = () => {
    if (goodcashEnvironment === "sandbox") {
      document.location.replace("goodcashsandbox://home");
    } else {
      document.location.replace("goodcash://home");
    }
  };

  return (
    <div className="bg-[#1C1D18] flex flex-col bg-no-repeat z-20 w-full max-w-[440px] bg-cover justify-center h-screen items-center">
      <div className="bg-gradient-to-b from-[#878E59] to-[#458ACA00] via-[#435756] h-screen w-full max-w-[440px] flex flex-col overflow-hidden justify-center items-center">
        <div className="bg-cqr-grass h-full w-full max-w-[440px] flex flex-col justify-center items-center bg-cover bg-no-repeat -mt-10">
          <h1 className="font-kansasNewSemiBold text-[#FDF2E7] text-[38px] leading-[44px] w-full text-center px-8 sm:px-24 absolute top-10">
            Welcome to GoodCash
          </h1>
          <Image
            src="/img/goodcash-card.svg"
            className="min-w-[141px] max-w-[160px]"
            alt="My SVG Image"
            width={100}
            height={100}
          />
          <Image
            src="/img/bottom-grass.svg"
            className="min-w-[141px] max-w-[160px] -mt-5"
            alt="My SVG Image"
            width={100}
            height={100}
          />
          <div className="h-20 sm:h-28 w-full" />
          <div className="w-full h-[200px] p-4 absolute bottom-0 sm:relative flex flex-col justify-center items-center">
            <text className="font-sharpGroteskMedium text-[#FFFFFF] text-[16px] leading-[24px] w-full text-center px-4 sm:px-14 mb-4">
              Activate your card now in the GoodCash app.
            </text>
            <div onClick={() => appStoreUrlHandler()}>
              <Image
                src="/img/app-store.png"
                alt="app store"
                width={120}
                height={36}
                priority={true}
              />
            </div>
            <div onClick={() => playStoreUrlHandler()}>
              <Image
                className="mt-4"
                src="/img/google-play.png"
                alt="play store"
                width={120}
                height={36}
                priority={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CQRPage;
