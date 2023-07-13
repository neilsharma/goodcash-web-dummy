import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { appStoreAppUrl, playStoreAppUrl } from "@/shared/constants";
import { redirectIfServerSideRendered } from "@/shared/hooks";
import Image from "next/image";
import { Check } from "react-feather";
import useTrackPage from "../../shared/hooks/useTrackPage";
import { ELocalStorageKeys, EScreenEventTitle } from "../../utils/types";
import { useEffect } from "react";

export default function NewCardOnTheWay() {
  useTrackPage(EScreenEventTitle.NEW_CARD_ON_THE_WAY);

  return (
    <OnboardingLayout>
      <Title className="text-primary text-center">
        Congratulations, your new GoodCash Card is on the way!
      </Title>
      <SubTitle className="mt-10 text-center text-boldText">
        Next, download the GoodCash app to start using GoodCash:
      </SubTitle>

      <div className="flex flex-col justify-between w-full mt-6 mx-6">
        <div className={`flex justify-start items-start text-gray-500`}>
          <div className="flex flex-col justify-center items-center text-primary">
            <div className="h-12 w-12 rounded-full bg-primary border-[3px] border-primary flex justify-center items-center">
              <Check size={25} color="white" />
            </div>
            <div className={`h-8 w-1 bg-primary`}></div>
          </div>
          <p className="mt-3 ml-4 text-lg text-boldText">You card has shipped!</p>
        </div>
        <div className={`flex items-start text-gray-500`}>
          <div className="flex flex-col justify-center items-center text-primary">
            <div className="h-12 w-12 rounded-full border-[3px] border-primary flex justify-center items-center">
              2
            </div>
            <div className={`h-12 w-1 bg-primary`}></div>
          </div>
          <p className="mt-3 ml-4 text-lg text-boldText pr-28">Download the GoodCash app</p>
        </div>
        <div className={`flex items-start text-gray-500`}>
          <div className="flex flex-col justify-center items-center text-primary">
            <div className="h-12 w-12 rounded-full border-[3px] border-primary flex justify-center items-center">
              3
            </div>
          </div>
          <p className="mt-3 ml-4 text-lg text-boldText pr-10">
            Activate your GoodCash Card via the app
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-12 my-12 sm:flex-row">
        <a href={appStoreAppUrl}>
          <Image src="/img/app-store.png" alt="app store" width={154} height={48} priority={true} />
        </a>
        <a href={playStoreAppUrl}>
          <Image
            src="/img/google-play.png"
            alt="play store"
            width={154}
            height={48}
            priority={true}
          />
        </a>
      </div>
      <div className="w-full flex justify-center items-center my-4">
        <Image
          src="/img/goodcash-card.svg"
          alt="Success"
          width={120}
          height={120}
          priority={true}
        />
      </div>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
