import OnboardingLayout from "@/components/OnboardingLayout";
import { redirectIfServerSideRendered, useConfirmUnload } from "@/shared/hooks";
import Image from "next/image";
import Title from "../../components/Title";
import Button from "../../components/Button";
import { useState } from "react";

export default function PaymentSuccessPage() {
  useConfirmUnload();
  const [isLoading, setIsLoading] = useState(false);
  // const { onboardingStepHandler } = useOnboarding();

  return (
    <OnboardingLayout>
      <div className="my-12 flex gap-20 flex-col justify-center items-center">
        <Image src="/img/check-circle.svg" alt="success" width={156} height={156} priority={true} />
        <Title className="text-primary text-[20px] mx-6">Payment complete!</Title>
        <Button
          isLoading={isLoading}
          onClick={() => {
            setIsLoading(true);
            // onboardingStepHandler(EStepStatus.IN_PROGRESS);
          }}
        >
          Continue
        </Button>
      </div>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
