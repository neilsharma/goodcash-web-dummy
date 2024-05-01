import dynamic from "next/dynamic";
import OnboardingLayout from "./OnboardingLayout";
import SubTitle from "./SubTitle";
import * as animationData from "../public/lottie/growing-tree.json";
import { useEffect, useState } from "react";
import { ProgressLoaderDefs } from "../shared/constants";

const ReactLottie = dynamic(() => import("react-lottie"), { ssr: false });

interface IProgressLoaderProps {
  type: keyof typeof ProgressLoaderDefs;
  animate?: boolean;
  initialValue?: number;
}
const ProgressLoader = ({ type, animate = true, initialValue = 0 }: IProgressLoaderProps) => {
  const [divWidth, setDivWidth] = useState(`${initialValue}%`);
  useEffect(() => {
    if (animate) {
      setTimeout(() => {
        setDivWidth("95%");
      }, 1000);
    }
  }, [animate]);

  return (
    <OnboardingLayout>
      <div className="flex flex-col justify-center items-center">
        <div className="w-[200px] h-[200px] mb-8 relative rounded-full bg-white justify-center items-center">
          <ReactLottie
            style={{
              position: "absolute",
              width: 600,
              height: 600,
              top: -200,
              left: -200,
            }}
            options={{ loop: true, autoplay: true, animationData }}
          />
        </div>
        <SubTitle className="text-center text-lg">{ProgressLoaderDefs[type].title}</SubTitle>
        <SubTitle className="text-center w-full mt-5 text-base">
          {ProgressLoaderDefs[type].text_line_1}
        </SubTitle>
        <SubTitle className="text-center w-full text-base">
          {ProgressLoaderDefs[type].text_line_2}
        </SubTitle>
        <div className="h-3 relative w-3/4 mt-10 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gray-200 absolute"></div>
          <div
            className={`transition-all ease-out ${
              ProgressLoaderDefs[type].duration === 5000
                ? "duration-[5000ms]"
                : "duration-[10000ms]"
            } rounded-full h-full bg-primary relative`}
            style={{
              width: divWidth,
            }}
          ></div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default ProgressLoader;
