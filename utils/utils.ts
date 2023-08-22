import { UserSession } from "@/shared/http/types";
import { getGtagSessionData } from "./analytics/gtag-analytics";

function convertFbclidToFbc(fbclid: string): string {
  const domainIndex = 1; // Assuming the cookie is defined on 'facebook.com'
  const creationTime = Date.now(); // Using the current timestamp

  // Generate the fbc value in the format: fb.version.subdomainIndex.creationTime.fbclid
  const fbc = `fb.${domainIndex}.${creationTime}.${fbclid}`;

  return fbc;
}

const sharpGroteskBook20FontUrl =
  process.env["NEXT_PUBLIC_GOODCASH_ENVIRONMENT"] === "production"
    ? "url(https://firebasestorage.googleapis.com/v0/b/goodcash-production.appspot.com/o/SharpGroteskBook20.otf?alt=media&token=99565d67-2721-4c0c-b167-460d79b9ce80)"
    : "url(https://firebasestorage.googleapis.com/v0/b/goodcash-sandbox.appspot.com/o/SharpGroteskBook20.otf?alt=media&token=9056812d-5fae-4bcd-899a-383675278a9f)";

export const sharpGroteskFont = {
  family: "SharpGroteskBook20",
  src: sharpGroteskBook20FontUrl,
};

function getFbSession(): {
  fbc?: string;
  fbp?: string;
} {
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get("fbclid");

  const params: {
    fbc?: string;
    fbp?: string;
  } = {};

  const cookies = document.cookie.split(";");
  let cookieFbclid: string | null = null;
  let cookieFbc: string | null = null;
  let cookieFbp: string | null = null;

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith("fbclid=")) {
      cookieFbclid = cookie.substring(7); // Remove 'fbclid=' prefix
    }
    if (cookie.startsWith("_fbc=")) {
      cookieFbc = cookie.substring(5); // Remove '_fbc=' prefix
    }
    if (cookie.startsWith("_fbp=")) {
      cookieFbp = cookie.substring(5); // Remove '_fbp=' prefix
    }
  }

  if (fbclid !== null) {
    const fbc = convertFbclidToFbc(fbclid);
    params.fbc = fbc;
  }

  if (cookieFbclid !== null) {
    const fbc = convertFbclidToFbc(cookieFbclid);
    params.fbc = fbc;
  }

  if (cookieFbc !== null) {
    params.fbc = cookieFbc;
  }

  if (cookieFbp !== null) {
    params.fbp = cookieFbp;
  }
  return params.fbc || params.fbp ? params : {};
}

function getGclid(): string {
  const urlParams = new URLSearchParams(window.location.search);
  const gclid = urlParams.get("gclid");

  if (gclid) {
    return gclid;
  }

  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith("gclid=")) {
      const gclidCookie = cookie.substring(6); // Remove 'gclid=' prefix
      return gclidCookie;
    }
  }
  return "";
}

async function getGaSession(): Promise<{
  gaSessionId?: string;
  gaSessionNumber?: string;
  gaClientId?: string;
  gclid?: string;
}> {
  const data = await getGtagSessionData();
  const gclidId = getGclid();
  return {
    gaSessionId: data?.sessionId,
    gaSessionNumber: data?.sessionNumber,
    gaClientId: data?.clientId,
    gclid: gclidId ?? data?.gclid,
  };
}

async function getUserSession(): Promise<UserSession | null> {
  const fbSession = getFbSession();
  const gaSession = await getGaSession();
  return {
    ...fbSession,
    ...gaSession,
  };
}

export { getUserSession };
