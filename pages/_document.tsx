import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <div
          id="recaptcha-container"
          className="fixed left-2/4 bottom-56 sm:bottom-48 -translate-x-1/2 z-20"
        />
        <NextScript />
      </body>
    </Html>
  );
}
