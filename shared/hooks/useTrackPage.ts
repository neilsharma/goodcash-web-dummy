import { useEffect } from "react";
import { trackPage } from "../../utils/analytics/analytics";
import { EScreenEventTitle } from "../../utils/types";

const useTrackPage = (screen: EScreenEventTitle) => {
  useEffect(() => {
    trackPage(screen);
  }, [screen]);
};

export default useTrackPage;
