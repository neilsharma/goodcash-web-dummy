import { useEffect } from "react";
import { setUserId, trackerInitializer } from "../../utils/analytics/analytics";
import { getUserInfoFromCache } from "../http/util";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config";

const useTrackerInitializer = () => {
  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    (async function () {
      if (analytics) {
        await trackerInitializer(analytics);

        const cachedUserInfo = getUserInfoFromCache();
        if (cachedUserInfo) {
          setUserId(cachedUserInfo.userId);
        }
      }
    })();
  }, []);
};

export default useTrackerInitializer;
