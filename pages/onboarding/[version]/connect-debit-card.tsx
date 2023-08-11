import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CardForm from "../../../components/CardForm";
import OnboardingLayout from "../../../components/OnboardingLayout";

// Replace 'your_stripe_publishable_key' with your actual Stripe publishable key
const stripePromise = loadStripe("your_stripe_publishable_key");

export default function AddCard() {
  return (
    <OnboardingLayout>
      <Elements stripe={stripePromise}>
        <CardForm />
      </Elements>
    </OnboardingLayout>
  );
}
