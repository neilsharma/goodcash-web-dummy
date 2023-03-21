import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <div id="recaptcha-container" className="fixed left-2/4 bottom-44 -translate-x-1/2" />
        <NextScript />
      </body>
    </Html>
  );
}
