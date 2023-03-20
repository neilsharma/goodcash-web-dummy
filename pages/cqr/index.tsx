import React from "react";
import { goodcashEnvironment } from "../../shared/config";
import Image from "next/image";
import { isAndroid, isIOS } from "react-device-detect";

const CQRPage = () => {
  const storeUrlHandler = () => {
    setTimeout(() => {
      if (isAndroid) {
        document.location.replace("https://play.google.com/store/apps");
      } else if (isIOS) {
        document.location.replace("https://apps.apple.com");
      }
    }, 1500);
  };

  const downloadButtonHandler = () => {
    if (goodcashEnvironment === "sandbox") {
      storeUrlHandler();
      document.location.replace("goodcashsandbox://home");
    } else {
      storeUrlHandler();
      document.location.replace("goodcash://home");
    }
  };

  return (
    <div className="bg-[#1C1D18] flex flex-col bg-no-repeat z-20 w-full max-w-[440px] bg-cover justify-center h-screen items-center">
      <div className="bg-gradient-to-b from-[#878E59] to-[#458ACA00] via-[#435756] h-screen w-full max-w-[440px] flex flex-col overflow-hidden justify-center items-center">
        <div className=" bg-cqr-grass h-full w-full max-w-[440px] flex flex-col justify-center items-center bg-cover bg-no-repeat -mt-10">
          <h1 className=" font-kansasNewSemiBold text-[#FDF2E7] text-[38px] leading-[44px] w-full text-center px-24 absolute top-10">
            Welcome to GoodCash
          </h1>
          <Image
            src="/img/goodcash-card.svg"
            className=" min-w-[141px] max-w-[160px]"
            alt="My SVG Image"
            width={100}
            height={100}
          />
          <Image
            src="/img/bottom-grass.svg"
            className=" min-w-[141px] max-w-[160px] -mt-5"
            alt="My SVG Image"
            width={100}
            height={100}
          />
          <div className="h-28 w-full" />
          <div className="w-full p-4 absolute bottom-10 flex flex-col justify-center items-center">
            <text className=" font-sharpGroteskMedium text-[#FFFFFF] text-[16px] leading-[24px] w-full text-center px-14 mb-4">
              Activate your card now in the GoodCash app.
            </text>
            <div
              onClick={downloadButtonHandler}
              className="w-10/12 h-16 rounded-xl bg-black flex justify-center items-center hover:cursor-pointer"
            >
              <Image src="img/apple-store.svg" width={150} height={150} alt="Apple store svg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CQRPage;
