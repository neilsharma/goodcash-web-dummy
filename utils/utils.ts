import { GCUser, ITransaction, ITransactions } from "../shared/http/types";
import { UserSession } from "@/shared/http/types";
import { getGtagSessionData } from "./analytics/gtag-analytics";
import { GCUserState } from "./types";
import { ESupportedErrorCodes } from "@/shared/error";

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

export const nonOnboardingPaths = ["/cqr", "/close-account"];

export { getUserSession };

export const transactionListSectionHandler = (inputDate: string) => {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
    new Date(`${inputDate}`)
  );
};

export const checkUserState = (state: GCUserState) => {
  let errorCode: ESupportedErrorCodes | null = null;
  let shouldSignOut = false;

  switch (state) {
    case GCUserState.ONBOARDING:
      errorCode = ESupportedErrorCodes.USER_ONBOARDING_INCOMPLETE;
      break;
    case GCUserState.BLOCKED:
      errorCode = ESupportedErrorCodes.USER_BLOCKED;
      shouldSignOut = true;
      break;
    case GCUserState.DELETED:
      errorCode = ESupportedErrorCodes.USER_DELETED;
      shouldSignOut = true;
      break;
  }

  return { errorCode, shouldSignOut };
};

export const groupTransactionsByDay = (transactions: ITransactions) => {
  const transactionSection: Record<string, Array<ITransaction>> = {};
  transactions.forEach((transaction) => {
    const date = new Date(transaction.createdAt);
    const day = date.toISOString().split("T")[0];

    if (!transactionSection[day]) {
      transactionSection[day] = [];
    }

    transactionSection[day].push(transaction);
  });
  return transactionSection;
};

export const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
  const element = event.currentTarget;
  const isAtEnd = element.scrollHeight - element.scrollTop <= element.clientHeight;
  return isAtEnd;
};

export const parseUserAddress = (userInfo: GCUser | null) => {
  const fullAddress = `${userInfo?.contactInfo?.addressLine1 || ""} ${
    userInfo?.contactInfo?.addressLine2 || ""
  } ${userInfo?.contactInfo?.addressLine3 || ""} ${userInfo?.contactInfo?.city || ""} ${
    userInfo?.contactInfo?.state || ""
  } ${userInfo?.contactInfo?.zip || ""}`
    .trim()
    .replace(/ +/g, " ");
  return fullAddress;
};

export const formatFullName = (user: GCUser | null) => {
  if (!user?.contactInfo) return;
  const { firstName, lastName } = user?.contactInfo;
  // Ensure both first and last names are provided
  if (!firstName && !lastName) {
    return "Unknown";
  }

  // Capitalize the first letter of the first name
  const formattedFirstName = firstName
    ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
    : "";

  // Capitalize the first letter of the last name
  const formattedLastName = lastName ? lastName.charAt(0).toUpperCase() + lastName.slice(1) : "";

  // Concatenate the formatted names with a space in between
  return `${formattedFirstName} ${formattedLastName}`.trim();
};

export const formatUSPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, ""); // Remove non-digit characters

  if (cleaned.length === 11) {
    return `(${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7)}`;
  }

  return phoneNumber; // Return the original input if not in the correct format
};
