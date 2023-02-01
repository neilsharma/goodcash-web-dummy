import Head from "next/head";
import { useOnboarding } from "@/shared/context/onboarding";
import Link from "next/link";

export default function Home() {
  const { testValue: val, setTestValue: setVal } = useOnboarding();

  return (
    <>
      <Head>
        <title>GoodCash App</title>
        <meta name="description" content="GoodCash web app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>Index.tsx: {String(val)}</div>
        <button onClick={() => setVal((v) => !v)}>toggle</button>
        <br />
        <Link href="/onboarding">to onboarding</Link>
      </main>
    </>
  );
}
