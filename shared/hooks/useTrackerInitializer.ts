import { useEffect } from "react";
import { trackPage, trackerInitializer } from "../../utils/analytics/analytics";
import { EScreenEventTitle } from "../../utils/types";
import { useGlobal } from "../context/global";

const useTrackerInitializer = () => {
  const { analytics } = useGlobal();
  useEffect(() => {
    (async function () {
      if (analytics) {
        await trackerInitializer(analytics);
      }
    })();
  }, [analytics]);
};

export default useTrackerInitializer;
