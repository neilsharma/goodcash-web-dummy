import { Metadata } from "next";
import { ErrorProvider } from "./error-context";
import "@/styles/globals.css";
import { GoogleAnalyticsTracking } from "@/utils/analytics/GoogleAnalytics";

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
      <body className="theme-goodcash">
        <div
          id="recaptcha-container"
          className="fixed left-2/4 bottom-[16.5rem] sm:bottom-72 -translate-x-1/2 z-20"
        />
        <div id="modal" />
        <GoogleAnalyticsTracking />
        <ErrorProvider>{children}</ErrorProvider>
      </body>
    </html>
  );
}
