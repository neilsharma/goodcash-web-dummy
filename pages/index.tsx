import Link from "next/link";
import { useOnboarding } from "../shared/context/onboarding";
import Loader from "../components/Loader";
import { useRouter } from "next/router";

export default function Home() {
  const { isLoadingUserInfo } = useOnboarding();
  const { query } = useRouter();
  if (isLoadingUserInfo) {
    return (
      <main>
        <Loader />
      </main>
    );
  }
  return (
    <main>
      <Link href={query.flowName ? `/onboarding/?flowName=${query.flowName}` : "/onboarding"}>
        to onboarding
      </Link>
    </main>
  );
}
