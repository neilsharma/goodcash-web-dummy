import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { onboardingStepToPageMap } from "@/shared/constants";
import { useOnboarding } from "@/shared/context/onboarding";
import { parseApiError } from "@/shared/error";
import {
  redirectIfServerSideRendered,
  useConfirmIsOAuthRedirect,
  useConfirmUnload,
} from "@/shared/hooks";
import { activateLineOfCredit, submitLineOfCredit } from "@/shared/http/services/loc";
import {
  createBankAccount,
  failBankAccountCreation,
  getPlaidToken,
} from "@/shared/http/services/plaid";
import { patchUserOnboarding, submitKyc } from "@/shared/http/services/user";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { PlaidLinkOnSuccessMetadata, PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { useGlobal } from "../../shared/context/global";
import useTrackPage from "../../shared/hooks/useTrackPage";
import { ELocalStorageKeys, EScreenEventTitle } from "../../utils/types";

export default function OnboardingConnectBankAccountPage() {
  useConfirmUnload();
  const isPlaidOAuthRedirect = useConfirmIsOAuthRedirect();

  useTrackPage(EScreenEventTitle.CONNECT_BANK_ACCOUNT);

  const { push } = useRouter();
  const { auth } = useGlobal();
  const {
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    setOnboardingStep,
    setPlaid,
    redirectToGenericErrorPage,
    phone,
    email,
    state,
    locId,
    setLocId,
    plaid,
  } = useOnboarding();
  const [plaidLinkToken, setPlaidLinkToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getLocalToken = async () => {
    const localToken = localStorage.getItem(ELocalStorageKeys.LINK_TOKEN);
    if (localToken) setPlaidLinkToken(localToken);
  };

  useEffect(() => {
    if (isPlaidOAuthRedirect) {
      getLocalToken();
      return;
    }
    if (auth?.currentUser) {
      getPlaidToken().then(async (link_token) => {
        setPlaidLinkToken(link_token);
        localStorage.setItem(ELocalStorageKeys.LINK_TOKEN, link_token);
        const auth_token = await auth?.currentUser?.getIdToken();
        const cached_user_info = {
          auth_token: auth_token,
          phone: phone,
          email: email,
          state: state,
        };
        auth_token &&
          localStorage.setItem(
            ELocalStorageKeys.CACHED_USER_INFO,
            JSON.stringify(cached_user_info)
          );
      });
    }
  }, [auth?.currentUser, email, isPlaidOAuthRedirect, phone, setPlaidLinkToken, state]);

  const kycAndLoc = useCallback(async () => {
    let _locId = locId;

    if (!_locId || !onboardingOperationsMap.kycSubmitted) {
      const kyc = await submitKyc();
      _locId = kyc.locId;
      setLocId(kyc.locId);
      setOnboardingOperationsMap((p) => ({ ...p, kycSubmitted: true }));
      patchUserOnboarding({ onboardingOperationsMap: { kycSubmitted: true } });
    }

    if (!onboardingOperationsMap.locSubmitted) {
      await submitLineOfCredit({ locId: _locId });
      setOnboardingOperationsMap((p) => ({ ...p, locSubmitted: true }));
      patchUserOnboarding({ onboardingOperationsMap: { locSubmitted: true } });
    }

    if (!onboardingOperationsMap.locActivated) {
      await activateLineOfCredit({ locId: _locId });
      setOnboardingOperationsMap((p) => ({ ...p, locActivated: true }));
      patchUserOnboarding({
        onboardingStep: "PROCESSING_APPLICATION",
        onboardingOperationsMap: { locActivated: true },
      });
    }

    setOnboardingStep("PROCESSING_APPLICATION");
    push(onboardingStepToPageMap.PROCESSING_APPLICATION);
  }, [
    onboardingOperationsMap,
    setOnboardingOperationsMap,
    locId,
    setLocId,
    setOnboardingStep,
    push,
  ]);

  const onPlaidLinkSuccess = async (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
    try {
      setIsLoading(true);

      if (!onboardingOperationsMap.bankAccountCreated) {
        await createBankAccount({ plaidPublicToken: publicToken });
        setOnboardingOperationsMap((p) => ({ ...p, bankAccountCreated: true }));
        setPlaid({ publicToken, metadata });
        patchUserOnboarding({
          plaid: { publicToken, metadata },
          onboardingOperationsMap: { bankAccountCreated: true },
        });
      }
      await kycAndLoc();
    } catch (e: any) {
      const errorObject = parseApiError(e);

      if (errorObject?.errorCode === "UNDERWRITING0001") {
        return push("/onboarding/not-enough-money");
      }

      redirectToGenericErrorPage();
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

    open();
  }, [open, ready, plaidLinkToken]);

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

      <Button
        disabled={!ready || !plaidLinkToken}
        isLoading={isLoading}
        onClick={
          plaid && onboardingOperationsMap.bankAccountCreated
            ? () => kycAndLoc().catch(redirectToGenericErrorPage)
            : onContinue
        }
      >
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
