import { useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";

const useStripePromise = (): Stripe | null => {
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY !== undefined) {
        const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        setStripe(await stripePromise);
      }
    };

    if (!stripe) {
      initializeStripe();
    }
  }, [stripe]);

  return stripe;
};

export default useStripePromise;
