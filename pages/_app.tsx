import { GlobalProvider } from "@/shared/context/global";
import { OnboardingProvider } from "@/shared/context/onboarding";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import useTrackerInitializer from "../shared/hooks/useTrackerInitializer";

export default function App({ Component, pageProps }: AppProps) {
  useTrackerInitializer();

  return (
    <>
      <Head>
        <title>GoodCash</title>
        <meta name="description" content="GoodCash Card - Build credit history safely" />
        <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlobalProvider>
        <OnboardingProvider>
          <Component {...pageProps} />
        </OnboardingProvider>
      </GlobalProvider>
    </>
  );
}
