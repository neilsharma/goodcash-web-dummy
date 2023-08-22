import React, { useCallback, useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { createFundingCard } from "../shared/http/services/debitCard";
import { useOnboarding } from "../shared/context/onboarding";
import { EStepStatus } from "../shared/types";
import { trackEvent } from "../utils/analytics/analytics";
import { ETrackEvent, IUserAddress } from "../utils/types";
import Button from "./Button";
import { patchUserOnboarding } from "../shared/http/services/user";
import DebitCardAddressForm from "./DebitCardAddressForm";
import { FormControlError } from "./form-control/shared";

function CardForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [cvcReady, setCvcReady] = useState(false);
  const [cvcValidationError, setCvcValidationError] = useState<string | undefined>(undefined);
  const [expiryReady, setExpiryReady] = useState(false);
  const [expiryValidationError, setExpiryValidationError] = useState<string | undefined>(undefined);
  const [cardReady, setCardReady] = useState(false);
  const [cardValidationError, setCardValidationError] = useState<string | undefined>(undefined);
  const [userAddress, setUserAddress] = useState<IUserAddress | null>(null);
  const { onboardingStepHandler, setOnboardingOperationsMap, setOnboardingStep } = useOnboarding();

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

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      try {
        setIsLoading(true);
        event.preventDefault();

        if (!stripe || !elements) {
          return;
        }

        const cardElement = elements.getElement(CardNumberElement);

        if (cardElement && userAddress) {
          const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
            billing_details: {
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
            onboardingStepHandler(EStepStatus.FAILED);
          } else {
            if (paymentMethod.card?.funding !== "debit") {
              setIsLoading(false);
              return setCardValidationError(
                "Only debit cards are allowed, Please enter a debit card number."
              );
            }
            const response = await createFundingCard({ paymentMethodId: paymentMethod?.id });

            if (response.state === "OPEN") {
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
            }
          }
        }
      } catch (error) {
        onboardingStepHandler(EStepStatus.FAILED);
      }
    },
    [
      elements,
      onboardingStepHandler,
      setOnboardingOperationsMap,
      setOnboardingStep,
      stripe,
      userAddress,
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
                    padding: "0px",
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
        Save debit card
      </Button>
    </form>
  );
}

export default CardForm;
