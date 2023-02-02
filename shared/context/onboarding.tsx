import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface IOnboardingContext {
  firstName: string;
  setFirstName: Dispatch<SetStateAction<string>>;
  lastName: string;
  setLastName: Dispatch<SetStateAction<string>>;
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;

  phoneVerified: boolean;
  setPhoneVerified: Dispatch<SetStateAction<boolean>>;

  plan: string | null;
  setPlan: Dispatch<SetStateAction<string | null>>;

  dateOfBirth: string;
  setDateOfBirth: Dispatch<SetStateAction<string>>;
  legalAddress: string;
  setLegalAddress: Dispatch<SetStateAction<string>>;
  aptNumber: string;
  setAptNumber: Dispatch<SetStateAction<string>>;
  city: string;
  setCity: Dispatch<SetStateAction<string>>;
  state: string;
  setState: Dispatch<SetStateAction<string>>;
  zipCode: string;
  setZipCode: Dispatch<SetStateAction<string>>;
  ssn: string;
  setSsn: Dispatch<SetStateAction<string>>;

  agreedToCardHolderAgreement: boolean;
  setAgreedToCardHolderAgreement: Dispatch<SetStateAction<boolean>>;
  agreedToAutopay: boolean;
  setAgreedToAutopay: Dispatch<SetStateAction<boolean>>;
  agreedToTermsOfService: boolean;
  setAgreedToTermsOfService: Dispatch<SetStateAction<boolean>>;

  plaid: null;
  setPlaid: Dispatch<SetStateAction<null>>;

  howDidYouHearAboutUs: string;
  setHowDidYouHearAboutUs: Dispatch<SetStateAction<string>>;
}

const onboardingContext = createContext<IOnboardingContext>(null as any);

export const OnboardingProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [phoneVerified, setPhoneVerified] = useState(false);

  const [plan, setPlan] = useState<string | null>(null);

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [legalAddress, setLegalAddress] = useState("");
  const [aptNumber, setAptNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [ssn, setSsn] = useState("");

  const [agreedToCardHolderAgreement, setAgreedToCardHolderAgreement] =
    useState(false);
  const [agreedToAutopay, setAgreedToAutopay] = useState(false);
  const [agreedToTermsOfService, setAgreedToTermsOfService] = useState(false);

  const [plaid, setPlaid] = useState(null);

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
        phoneVerified,
        setPhoneVerified,
        plan,
        setPlan,
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
