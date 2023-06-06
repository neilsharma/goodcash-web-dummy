import { UserSession } from "@/shared/http/types";

function convertFbclidToFbc(fbclid: string): string {
  const domainIndex = 1; // Assuming the cookie is defined on 'facebook.com'
  const creationTime = Date.now(); // Using the current timestamp

  // Generate the fbc value in the format: fb.version.subdomainIndex.creationTime.fbclid
  const fbc = `fb.${domainIndex}.${creationTime}.${fbclid}`;

  return fbc;
}

function getUserSession(): UserSession | null {
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get("fbclid");

  const params: UserSession = {};

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
  return params.fbc || params.fbp ? params : null;
}

export { getUserSession };
