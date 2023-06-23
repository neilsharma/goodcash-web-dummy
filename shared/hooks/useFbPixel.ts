import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { fbPixelId, goodcashEnvironment } from "../config";

const useFbPixel = () => {
  const router = useRouter();
  const fbPixelRef = useRef<typeof import("node_modules/react-facebook-pixel/types/index") | null>(
    null
  );

  useEffect(() => {
    if (goodcashEnvironment === "production") {
      import("react-facebook-pixel")
        .then((x) => x.default)
        .then((ReactPixel) => {
          ReactPixel.init(fbPixelId); // facebookPixelId
          fbPixelRef.current = ReactPixel;
        });
    }
  }, [router.events]);
  return [fbPixelRef.current?.trackCustom];
};

export default useFbPixel;
