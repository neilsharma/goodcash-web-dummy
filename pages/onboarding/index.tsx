import { useOnboarding } from "@/shared/context/onboarding";
import Link from "next/link";

export default function Onboarding() {
  const { testValue: val, setTestValue: setVal } = useOnboarding();

  return (
    <main>
      <div>Onboarding: {String(val)}</div>
      <button onClick={() => setVal((v) => !v)}>toggle</button>
      <br />
      <Link href="/">to home</Link>
    </main>
  );
}
