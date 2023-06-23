import { useEffect } from "react";
import { trackPage } from "../../utils/analytics/analytics";
import { EScreenEventTitle } from "../../utils/types";
import useFbPixel from "./useFbPixel";

const useTrackPage = (screen: EScreenEventTitle) => {
  const [fbPixelTrackPage] = useFbPixel();
  useEffect(() => {
    trackPage(screen);
    fbPixelTrackPage?.(screen);
  }, [fbPixelTrackPage, screen]);
};

export default useTrackPage;
