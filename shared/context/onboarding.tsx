import { ConfirmationResult } from "firebase/auth";
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import type { PlaidLinkOnSuccessMetadata } from "react-plaid-link";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import { GCUser } from "../http/types";
import { EUsaStates } from "../types";

export interface IOnboardingContext {
  firstName: string;
  setFirstName: Dispatch<SetStateAction<string>>;
  lastName: string;
  setLastName: Dispatch<SetStateAction<string>>;
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  indexPageIsValid: boolean;

  phoneVerified: boolean;
  setPhoneVerified: Dispatch<SetStateAction<boolean>>;

  plan: string | null;
  setPlan: Dispatch<SetStateAction<string | null>>;
  user: GCUser | null;
  setUser: Dispatch<SetStateAction<GCUser | null>>;

  dateOfBirth: Date | null;
  setDateOfBirth: Dispatch<SetStateAction<Date | null>>;
  legalAddress: string;
  setLegalAddress: Dispatch<SetStateAction<string>>;
  aptNumber: string;
  setAptNumber: Dispatch<SetStateAction<string>>;
  city: string;
  setCity: Dispatch<SetStateAction<string>>;
  state: EUsaStates | "";
  setState: Dispatch<SetStateAction<EUsaStates | "">>;
  zipCode: string;
  setZipCode: Dispatch<SetStateAction<string>>;
  ssn: string;
  setSsn: Dispatch<SetStateAction<string>>;
  is18YearsOld: boolean;
  contactInfoPageIsValid: boolean;

  agreedToCardHolderAgreement: boolean;
  setAgreedToCardHolderAgreement: Dispatch<SetStateAction<boolean>>;
  agreedToAutopay: boolean;
  setAgreedToAutopay: Dispatch<SetStateAction<boolean>>;
  agreedToTermsOfService: boolean;
  setAgreedToTermsOfService: Dispatch<SetStateAction<boolean>>;

  plaid: PlaidPayload;
  setPlaid: Dispatch<SetStateAction<PlaidPayload>>;

  howDidYouHearAboutUs: string;
  setHowDidYouHearAboutUs: Dispatch<SetStateAction<string>>;
}

type PlaidPayload = null | { publicToken: string; metadata: PlaidLinkOnSuccessMetadata };

const onboardingContext = createContext<IOnboardingContext>(null as any);

export const OnboardingProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const indexPageIsValid = useMemo(() => {
    return !!(
      firstName &&
      lastName &&
      isMobilePhone(phone, "en-US", { strictMode: true }) &&
      isEmail(email)
    );
  }, [firstName, lastName, phone, email]);

  const [phoneVerified, setPhoneVerified] = useState(false);

  const [plan, setPlan] = useState<string | null>(null);

  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [legalAddress, setLegalAddress] = useState("");
  const [aptNumber, setAptNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState<EUsaStates | "">("");
  const [zipCode, setZipCode] = useState("");
  const [ssn, setSsn] = useState("");

  const [agreedToCardHolderAgreement, setAgreedToCardHolderAgreement] = useState(false);
  const [agreedToAutopay, setAgreedToAutopay] = useState(false);
  const [agreedToTermsOfService, setAgreedToTermsOfService] = useState(false);

  const is18YearsOld = useMemo(() => {
    if (!dateOfBirth) return false;

    const age = ~~((Date.now() - dateOfBirth.getTime()) / 31557600000);

    return age >= 18;
  }, [dateOfBirth]);

  const contactInfoPageIsValid = useMemo(
    () =>
      is18YearsOld &&
      !!legalAddress &&
      !!city &&
      !!state &&
      !!zipCode &&
      !!ssn &&
      agreedToCardHolderAgreement &&
      agreedToAutopay &&
      agreedToTermsOfService,
    [
      is18YearsOld,
      legalAddress,
      city,
      state,
      zipCode,
      ssn,
      agreedToCardHolderAgreement,
      agreedToAutopay,
      agreedToTermsOfService,
    ]
  );

  const [plaid, setPlaid] = useState<PlaidPayload>(null);
  const [user, setUser] = useState<IOnboardingContext["user"]>(null);

  const [howDidYouHearAboutUs, setHowDidYouHearAboutUs] = useState("");

  return (
    <onboardingContext.Provider
      value={{
        firstName,
        setFirstName,
        lastName,
        setLastName,
        phone,
        setPhone,
        email,
        setEmail,
        indexPageIsValid,

        phoneVerified,
        setPhoneVerified,

        plan,
        setPlan,
        user,
        setUser,

        dateOfBirth,
        setDateOfBirth,
        legalAddress,
        setLegalAddress,
        aptNumber,
        setAptNumber,
        city,
        setCity,
        state,
        setState,
        zipCode,
        setZipCode,
        ssn,
        setSsn,
        agreedToCardHolderAgreement,
        setAgreedToCardHolderAgreement,
        agreedToAutopay,
        setAgreedToAutopay,
        agreedToTermsOfService,
        setAgreedToTermsOfService,
        is18YearsOld,
        contactInfoPageIsValid,

        plaid,
        setPlaid,

        howDidYouHearAboutUs,
        setHowDidYouHearAboutUs,
      }}
    >
      {children}
    </onboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(onboardingContext);
