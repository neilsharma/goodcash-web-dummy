import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { useOnboarding } from "@/shared/context/onboarding";
import { extractApiErrorCode } from "@/shared/error";
import {
  redirectIfServerSideRendered,
  useConfirmIsOAuthRedirect,
  useConfirmUnload,
} from "@/shared/hooks";
import { PlaidHttpService } from "@/shared/http/services/plaid";
import { UserHttpService } from "@/shared/http/services/user";
import { ConversionEvent, trackGTagConversion } from "@/utils/analytics/gtag-analytics";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { PlaidLinkOnSuccessMetadata, PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { useGlobal } from "../../../shared/context/global";
import useTrackPage from "../../../shared/hooks/useTrackPage";
import { KYCFieldState } from "../../../shared/http/types";
import { ELocalStorageKeys, EScreenEventTitle } from "../../../utils/types";
import { EStepStatus } from "../../../shared/types";
import { getUserInfoFromCache } from "../../../shared/http/util";
import { useErrorContext } from "../../../shared/context/error";
import pagesRouterHttpClient from "@/shared/http/clients/pages-router";

const { createBankAccount, failBankAccountCreation, getPlaidToken, longPollBankCreation } =
  new PlaidHttpService(pagesRouterHttpClient);
const { getLatestKycAttempt, patchUserOnboarding } = new UserHttpService(pagesRouterHttpClient);

export default function OnboardingConnectBankAccountPage() {
  useConfirmUnload();
  const isPlaidOAuthRedirect = useConfirmIsOAuthRedirect();

  useTrackPage(EScreenEventTitle.CONNECT_BANK_ACCOUNT);

  const { auth } = useGlobal();
  const { setErrorCode } = useErrorContext();
  const {
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setOnboardingStep,
    setPlaid,
    cacheUser,
    onboardingStepHandler,
    mergeOnboardingStateHandler,
  } = useOnboarding();
  const [plaidLinkToken, setPlaidLinkToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getLocalToken = async () => {
    const localToken = localStorage.getItem(ELocalStorageKeys.LINK_TOKEN);
    if (localToken) setPlaidLinkToken(localToken);
  };

  useEffect(() => {
    if (isPlaidOAuthRedirect) {
      const cachedUserInfo = getUserInfoFromCache();
      if (cachedUserInfo?.auth_token) {
        mergeOnboardingStateHandler(cachedUserInfo?.auth_token);
      }
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaidOAuthRedirect]);

  useEffect(() => {
    if (isPlaidOAuthRedirect) {
      getLocalToken();
      return;
    }
    if (auth?.currentUser) {
      getPlaidToken().then(async (link_token) => {
        setPlaidLinkToken(link_token);
        localStorage.setItem(ELocalStorageKeys.LINK_TOKEN, link_token);
        await cacheUser();
      });
    }
  }, [cacheUser, auth?.currentUser, isPlaidOAuthRedirect, setPlaidLinkToken]);

  const createBankAccountHandler = useCallback(
    async (publicToken: string, metadata?: PlaidLinkOnSuccessMetadata) => {
      try {
        trackGTagConversion(ConversionEvent.BankAccountLinked);

        await createBankAccount({ plaidPublicToken: publicToken });
        const { status, error } = await longPollBankCreation();
        if (status === "COMPLETED") {
          setOnboardingOperationsMap((p) => ({
            ...p,
            bankAccountCreated: true,
          }));

          metadata && setPlaid({ publicToken, metadata });

          patchUserOnboarding({
            plaid: { publicToken, metadata },
            onboardingStep: "PAYMENT_METHOD_VERIFICATION",
            onboardingOperationsMap: {
              bankAccountCreated: true,
            },
          });

          trackGTagConversion(ConversionEvent.BankAccountConnected);

          setOnboardingStep("PAYMENT_METHOD_VERIFICATION");
          onboardingStepHandler(EStepStatus.COMPLETED);
        } else if (status === "FAILED") {
          setErrorCode(error);
        }
      } catch (error) {
        onboardingStepHandler(EStepStatus.FAILED);
        setIsLoading(false);
        setErrorCode(extractApiErrorCode(error));
      }
    },
    [onboardingStepHandler, setErrorCode, setOnboardingOperationsMap, setOnboardingStep, setPlaid]
  );

  const onPlaidLinkSuccess = async (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
    try {
      setIsLoading(true);

      if (!onboardingOperationsMap.bankAccountCreated) {
        await createBankAccountHandler(publicToken, metadata);
      }
    } catch (e: any) {
      onboardingStepHandler(EStepStatus.FAILED);
      setErrorCode(extractApiErrorCode(e));
      setIsLoading(false);
    }
  };

  const plaidConfig: PlaidLinkOptions = {
    // token must be the same token used for the first initialization of Link
    token: plaidLinkToken,
    onSuccess: onPlaidLinkSuccess,
    onExit: async (error, metadata) => {
      await failBankAccountCreation({ error, metadata });
    },
  };

  if (isPlaidOAuthRedirect) {
    // receivedRedirectUri must include the query params
    plaidConfig.receivedRedirectUri = window.location.href;
  }

  const { open, ready } = usePlaidLink(plaidConfig);

  useEffect(() => {
    // If OAuth redirect, instantly open link when it is ready instead of
    // making user click the button
    if (isPlaidOAuthRedirect && ready) {
      open();
    }
  }, [ready, open, isPlaidOAuthRedirect]);

  const onContinue = useCallback(async () => {
    if (!ready || !plaidLinkToken) return;
    const bankConnectionStatus = await getLatestKycAttempt();
    if (bankConnectionStatus.bankConnectionState === KYCFieldState.READY) {
      setIsLoading(true);
      return createBankAccountHandler("");
    }

    open();
  }, [ready, plaidLinkToken, open, createBankAccountHandler]);

  return (
    <OnboardingLayout>
      <Title>Connect your checking account</Title>
      <SubTitle>
        GoodCash uses Plaid to securely connect to your checking account. GoodCash does not retain
        your bank login information.
      </SubTitle>
      <div className="my-12 font-sharpGroteskBook text-black">
        <p className="text-lg my-4">This connection allow GoodCash to:</p>

        {connectionWillAllow.map(([logo, text]) => (
          <div className="my-4 flex gap-2 items-start" key={logo + text}>
            <Image
              src={`/img/logo/${logo}.svg`}
              alt="lock"
              width={24}
              height={24}
              priority={true}
            />
            <p>{text}</p>
          </div>
        ))}
      </div>

      <Button disabled={!ready || !plaidLinkToken} isLoading={isLoading} onClick={onContinue}>
        Continue
      </Button>
    </OnboardingLayout>
  );
}

const connectionWillAllow = [
  ["lock", "Determine your eligibility"],
  ["dollar", "Calculate your “Spend Power”"],
  ["cart", "Use your bank account to cover your GoodCash purchases"],
  ["trending-up", "Give your regular bank account super powers like growing your credit"],
];

export const getServerSideProps = redirectIfServerSideRendered;
