import React, { useCallback, useMemo, useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { createFundingCard, verifyFundingCard } from "../shared/http/services/debitCard";
import { IOnboardingContext, useOnboarding } from "../shared/context/onboarding";
import { EStepStatus } from "../shared/types";
import { trackEvent } from "../utils/analytics/analytics";
import { ELocalStorageKeys, ETrackEvent, IUserAddress } from "../utils/types";
import Button from "./Button";
import { getUser, patchUserOnboarding } from "../shared/http/services/user";
import DebitCardAddressForm from "./DebitCardAddressForm";
import { FormControlError } from "./form-control/shared";
import { FundingCardState } from "@/shared/http/types";
import { goodcashEnvironment } from "@/shared/config";
import { useErrorContext } from "../shared/context/error";
import { extractApiErrorCode } from "@/shared/error";

function CardForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { setErrorCode } = useErrorContext();

  const [isLoading, setIsLoading] = useState(false);
  const [cvcReady, setCvcReady] = useState(false);
  const [cvcValidationError, setCvcValidationError] = useState<string | undefined>(undefined);
  const [expiryReady, setExpiryReady] = useState(false);
  const [expiryValidationError, setExpiryValidationError] = useState<string | undefined>(undefined);
  const [cardReady, setCardReady] = useState(false);
  const [cardValidationError, setCardValidationError] = useState<string | undefined>(undefined);
  const [userAddress, setUserAddress] = useState<IUserAddress | null>(null);
  const {
    cacheUser,
    onboardingStepHandler,
    setOnboardingOperationsMap,
    setOnboardingStep,
    version,
  } = useOnboarding();

  const isAddressComplete = () => {
    if (
      !userAddress?.addressLine1 ||
      !userAddress?.city ||
      !userAddress?.state ||
      !userAddress?.zipCode
    ) {
      return true;
    }
    return false;
  };

  const userPromise = useMemo(getUser, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      try {
        setIsLoading(true);
        event.preventDefault();

        if (!stripe || !elements) {
          return;
        }

        const cardElement = elements.getElement(CardNumberElement);

        const user = await userPromise.catch(() => null);

        if (cardElement && userAddress) {
          const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
            billing_details: {
              name:
                user?.contactInfo?.firstName && user.contactInfo.lastName
                  ? `${user.contactInfo?.firstName} ${user.contactInfo?.lastName}`
                  : undefined,
              phone: user?.contactInfo?.phone || undefined,
              email: user?.contactInfo?.email || undefined,
              address: {
                city: userAddress.city || "",
                country: "US",
                postal_code: userAddress.zipCode || "",
                state: userAddress.state || "",
                line1: userAddress.addressLine1 || "",
                line2: userAddress.addressLine2 || "",
              },
            },
          });

          if (error) {
            trackEvent({
              event: ETrackEvent.ADD_FUNDING_CARD_FAILED,
            });
            setErrorCode(error.code);
            onboardingStepHandler(EStepStatus.FAILED);
          } else {
            if (goodcashEnvironment === "production" && paymentMethod.card?.funding !== "debit") {
              setIsLoading(false);
              return setCardValidationError(
                "Only debit cards are allowed, Please enter a debit card number."
              );
            }

            const fundingCard = await createFundingCard({ paymentMethodId: paymentMethod?.id });

            if (fundingCard.state === FundingCardState.OPEN) {
              onAfterConfirm({
                setOnboardingOperationsMap,
                setOnboardingStep,
                onboardingStepHandler,
              });
            } else if (fundingCard.state === FundingCardState.VERIFYING) {
              let { paymentIntent, error: paymentIntentRetrievalError } =
                await stripe.retrievePaymentIntent(fundingCard.paymentIntentClientSecret);

              if (paymentIntentRetrievalError || !paymentIntent) {
                setErrorCode(paymentIntentRetrievalError?.code);
                return;
              }

              const returnUrl = `${window.location.origin}/onboarding/${version}/confirm-setup-landing`;

              localStorage.setItem(
                ELocalStorageKeys.CARD_VERIFICATION_DATA,
                JSON.stringify({
                  paymentIntentId: paymentIntent.id,
                  paymentMethodId: paymentMethod.id,
                  paymentIntentClientSecret: fundingCard.paymentIntentClientSecret,
                })
              );

              await cacheUser();

              await stripe.confirmPayment({
                clientSecret: fundingCard.paymentIntentClientSecret,
                redirect: "if_required",
                confirmParams: { return_url: returnUrl },
              });

              await verifyFundingCard({
                paymentIntentId: paymentIntent.id,
                paymentMethodId: paymentMethod.id,
                paymentIntentClientSecret: fundingCard.paymentIntentClientSecret,
              });

              onAfterConfirm({
                setOnboardingOperationsMap,
                setOnboardingStep,
                onboardingStepHandler,
              });
            }
          }
        }
      } catch (error) {
        onboardingStepHandler(EStepStatus.FAILED);
        setIsLoading(false);
        setErrorCode(extractApiErrorCode(error));
      }
    },
    [
      stripe,
      elements,
      userPromise,
      userAddress,
      setErrorCode,
      onboardingStepHandler,
      setOnboardingOperationsMap,
      setOnboardingStep,
      version,
      cacheUser,
    ]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <span className="text-text font-sharpGroteskMedium text-sm">Debit card number</span>
        <div className="">
          <div className="my-2 bg-white rounded-md border-[1px] border-solid border-gray-500/20">
            <CardNumberElement
              onChange={(event) => {
                setCardReady(event.complete || !event.error || !event.empty);
                setCardValidationError(event.error?.message);
              }}
              className="bg-white p-4 rounded-md"
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                    fontFamily: "SharpGroteskBook20",
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
            <FormControlError error={cardValidationError} />
          </div>
          <div className="my-8 flex flex-row">
            <div className="w-1/2 mr-2">
              <div className="text-text font-sharpGroteskMedium text-sm mb-2">Expiry date</div>
              <CardExpiryElement
                onChange={(event) => {
                  setExpiryReady(event.complete || !event.error || !event.empty);
                  setExpiryValidationError(event.error?.message);
                }}
                className="bg-white p-4 rounded-md border-[1px] border-solid border-gray-500/20"
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                      fontFamily: "SharpGroteskBook20",
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
              <FormControlError className="relative" error={expiryValidationError} />
            </div>
            <div className="w-1/2 ml-2">
              <div className="text-text font-sharpGroteskMedium text-sm mb-2">CVC</div>
              <CardCvcElement
                onChange={(event) => {
                  setCvcReady(event.complete || !event.error || !event.empty);
                  setCvcValidationError(event.error?.message);
                }}
                className="bg-white p-4 rounded-md border-[1px] border-solid border-gray-500/20"
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },

                      fontFamily: "SharpGroteskBook20",
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
              <FormControlError className="relative" error={cvcValidationError} />
            </div>
          </div>
        </div>
      </div>
      <div className="text-text font-sharpGroteskMedium text-md">Billing Address</div>
      <DebitCardAddressForm setBillingAddress={setUserAddress} />
      <Button
        className="mt-10"
        disabled={!stripe || isAddressComplete() || !cvcReady || !cardReady || !expiryReady}
        isLoading={isLoading}
        onClick={handleSubmit}
      >
        Pay with debit card
      </Button>
    </form>
  );
}

interface OnAfterConfirmProps {
  setOnboardingStep: IOnboardingContext["setOnboardingStep"];
  setOnboardingOperationsMap: IOnboardingContext["setOnboardingOperationsMap"];
  onboardingStepHandler: IOnboardingContext["onboardingStepHandler"];
}

export const onAfterConfirm = ({
  setOnboardingOperationsMap,
  setOnboardingStep,
  onboardingStepHandler,
}: OnAfterConfirmProps) => {
  setOnboardingOperationsMap((p) => ({
    ...p,
    fundingCardLinked: true,
  }));

  patchUserOnboarding({
    onboardingStep: "PAYMENT_METHOD_VERIFICATION",
    onboardingOperationsMap: {
      fundingCardLinked: true,
    },
  });

  setOnboardingStep("PAYMENT_METHOD_VERIFICATION");

  trackEvent({
    event: ETrackEvent.ADD_FUNDING_CARD_SUCCESS,
  });

  onboardingStepHandler(EStepStatus.COMPLETED);

  localStorage.removeItem(ELocalStorageKeys.CARD_VERIFICATION_DATA);
};

export default CardForm;
