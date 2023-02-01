import { OnboardingProvider } from "@/shared/context/onboarding";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <OnboardingProvider>
      <Component {...pageProps} />
    </OnboardingProvider>
  );
}
