import Link from "next/link";
import { useOnboarding } from "../shared/context/onboarding";
import Loader from "../components/Loader";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const { isLoadingUserInfo } = useOnboarding();
  const params = useSearchParams();
  const flowName = params?.get("flowName");
  if (isLoadingUserInfo) {
    return (
      <main>
        <Loader />
      </main>
    );
  }
  return (
    <main>
      <Link href={flowName ? `/onboarding/?flowName=${flowName}` : "/onboarding"}>
        to onboarding
      </Link>
    </main>
  );
}
