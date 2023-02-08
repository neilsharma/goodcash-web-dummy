import { GlobalProvider } from "@/shared/context/global";
import { OnboardingProvider } from "@/shared/context/onboarding";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>GoodCash</title>
        <meta name="description" content="GoodCash web app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
