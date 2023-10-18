import { useEffect, useRef } from "react";
import { fbPixelId, goodcashEnvironment } from "../config";
import { usePathname, useSearchParams } from "next/navigation";

const useFbPixel = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
  }, [pathname, searchParams]);
  return [fbPixelRef.current?.trackCustom];
};

export default useFbPixel;
