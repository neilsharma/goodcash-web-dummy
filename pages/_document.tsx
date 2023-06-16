import { goodcashEnvironment, gtagId } from "@/shared/config";
import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <div
          id="recaptcha-container"
          className="fixed left-2/4 bottom-[16.5rem] sm:bottom-72 -translate-x-1/2 z-20"
        />

        {goodcashEnvironment === "production" ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${gtagId}');

                window.gtag = gtag;
              `}
            </Script>
          </>
        ) : null}
        <NextScript />
      </body>
    </Html>
  );
}
