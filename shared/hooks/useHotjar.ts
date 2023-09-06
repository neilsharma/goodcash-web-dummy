import Hotjar from "@hotjar/browser";
import { useEffect } from "react";

const useHotjar = () => {
  useEffect(() => {
    const siteId = process.env["NEXT_PUBLIC_HOTJAR_SITE_ID"];
    const hotjarVersion = 6;
    if (siteId) {
      Hotjar.init(parseInt(siteId), hotjarVersion);
    }
  }, []);

  return null;
};

export default useHotjar;
