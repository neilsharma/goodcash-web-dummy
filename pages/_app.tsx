import { GlobalProvider } from "@/shared/context/global";
import { OnboardingProvider } from "@/shared/context/onboarding";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import useTrackerInitializer from "../shared/hooks/useTrackerInitializer";
import useHotjar from "../shared/hooks/useHotjar";
import { ErrorProvider } from "../shared/context/error";

export default function App({ Component, pageProps }: AppProps) {
  useTrackerInitializer();
  useHotjar();

  return (
    <>
      <Head>
        <title>GoodCash</title>
        <meta name="description" content="GoodCash Card - Build credit history safely" />
        <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1" />

        <meta http-equiv="cache-control" content="no-cache" />
        <meta http-equiv="expires" content="0" />
        <meta http-equiv="pragma" content="no-cache" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlobalProvider>
        <ErrorProvider>
          <OnboardingProvider>
            <Component {...pageProps} />
          </OnboardingProvider>
        </ErrorProvider>
      </GlobalProvider>
    </>
  );
}
