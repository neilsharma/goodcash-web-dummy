import Link from "next/link";
import { useOnboarding } from "../shared/context/onboarding";
import Loader from "../components/Loader";

export default function Home() {
  const { isLoadingUserInfo } = useOnboarding();
  if (isLoadingUserInfo) {
    return (
      <main>
        <Loader />
      </main>
    );
  }
  return (
    <main>
      <Link href="/onboarding">to onboarding</Link>
    </main>
  );
}
