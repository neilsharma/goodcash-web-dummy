import Button from "@/components/Button";
import OnboardingLayout from "@/components/OnboardingLayout";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { redirectIfServerSideRendered } from "@/shared/hooks";
import { EScreenEventTitle } from "../../utils/types";
import useTrackPage from "../../shared/hooks/useTrackPage";

export default function UserIsBlockedPage() {
  useTrackPage(EScreenEventTitle.USER_ID_BLOCKED);

  return (
    <OnboardingLayout skipGuard>
      <Title>Sorry, something went wrong</Title>
      <SubTitle className="my-4">
        Sorry, looks like something went wrong during your application process.
      </SubTitle>
      <SubTitle className="my-4">
        Most likely underwriting attempt failed. Contact our support for further questions.
      </SubTitle>

      <Button className="my-12" variant="text">
        Contact support
      </Button>
    </OnboardingLayout>
  );
}

export const getServerSideProps = redirectIfServerSideRendered;
