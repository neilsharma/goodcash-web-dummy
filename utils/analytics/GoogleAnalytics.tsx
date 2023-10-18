import Script from "next/script";
import { goodcashEnvironment, gtagId } from "@/shared/config";

export const GoogleAnalyticsTracking = () => {
  return (
    <>
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
    </>
  );
};
