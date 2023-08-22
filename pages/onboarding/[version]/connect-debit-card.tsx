import { Elements } from "@stripe/react-stripe-js";
import CardForm from "../../../components/CardForm";
import OnboardingLayout from "../../../components/OnboardingLayout";
import { useConfirmUnload } from "../../../shared/hooks";
import Title from "../../../components/Title";
import SubTitle from "../../../components/SubTitle";
import { useOnboarding } from "../../../shared/context/onboarding";
import { sharpGroteskFont } from "../../../utils/utils";

export default function AddCard() {
  useConfirmUnload();
  const { stripe } = useOnboarding();

  return (
    <OnboardingLayout>
      <Title>Link your debit card</Title>
      <SubTitle className="mb-5">
        Enter the debit card details that you’ll use to pay for your subscription and fund your
        GoodCash spending.
      </SubTitle>
      <Elements
        stripe={stripe}
        options={{
          fonts: [sharpGroteskFont],
        }}
      >
        <CardForm />
      </Elements>
    </OnboardingLayout>
  );
}
