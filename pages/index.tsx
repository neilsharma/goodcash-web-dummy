import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>GoodCash App</title>
        <meta name="description" content="GoodCash web app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Link href="/onboarding">to onboarding</Link>
      </main>
    </>
  );
}
