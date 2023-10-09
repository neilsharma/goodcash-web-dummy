import { useCallback, useEffect } from "react";
import { trackPage as analyticsTrackPage } from "../../utils/analytics/analytics";
import { EScreenEventTitle } from "../../utils/types";
import useFbPixel from "./useFbPixel";

export const useGetTrackPage = () => {
  const [fbPixelTrackPage] = useFbPixel();

  const trackPage = useCallback(
    (screen: EScreenEventTitle, errorCode?: string) => {
      analyticsTrackPage(screen, errorCode);
      fbPixelTrackPage?.(screen);
    },
    [fbPixelTrackPage]
  );

  return trackPage;
};

const useTrackPage = (screen: EScreenEventTitle) => {
  const trackPage = useGetTrackPage();

  useEffect(() => {
    trackPage(screen);
  }, [trackPage, screen]);
};

export default useTrackPage;
