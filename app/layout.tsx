import { Metadata } from "next";
import { WebAppErrorProvider } from "@/app/context/webAppError";
import { GlobalProvider } from "@/shared/context/global";
import "@/styles/globals.css";
import { WebAppProvider } from "./context/webApp";
import { GoogleAnalyticsTracking } from "@/utils/analytics/GoogleAnalytics";
import WebAppLayout from "@/components/WebAppLayout";

export const metadata: Metadata = {
  title: "GoodCash App",
  description: "GoodCash Card - Build credit history safely",
  viewport: "width=device-width, initial-scale=1 maximum-scale=1",
  icons: "/favicon.ico",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <div
          id="recaptcha-container"
          className="fixed left-2/4 bottom-[16.5rem] sm:bottom-72 -translate-x-1/2 z-20"
        />
        <GoogleAnalyticsTracking />
        <GlobalProvider>
          <WebAppLayout>
            <WebAppErrorProvider>
              <WebAppProvider>{children}</WebAppProvider>
            </WebAppErrorProvider>
          </WebAppLayout>
        </GlobalProvider>
      </body>
    </html>
  );
}
