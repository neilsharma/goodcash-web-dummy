import { useRouter } from "next/router";
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { PlaidLinkOnSuccessMetadata } from "react-plaid-link";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import { GCUser } from "../http/types";
import type { EUsaStates, OnboardingStep, RecursivePartial, SharedOnboardingState } from "../types";

export interface IOnboardingContext {
  onboardingOperationsMap: OnboardingOperationsMap;
  setOnboardingOperationsMap: Dispatch<SetStateAction<OnboardingOperationsMap>>;
  onboardingStep: OnboardingStep;
  setOnboardingStep: Dispatch<SetStateAction<OnboardingStep>>;

  isUserBlocked: boolean;
  setIsUserBlocked: Dispatch<SetStateAction<boolean>>;

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
  locId: string;
  setLocId: Dispatch<SetStateAction<string>>;

  pierBorrowerId: string | null;
  setPierBorrowerId: Dispatch<SetStateAction<string | null>>;
  pierApplicationId: string | null;
  setPierApplicationId: Dispatch<SetStateAction<string | null>>;
  pierLoanAgreementId: string | null;
  setPierLoanAgreementId: Dispatch<SetStateAction<string | null>>;
  pierLoanAgreementDocumentUrl: string | null;
  setPierLoanAgreementDocumentUrl: Dispatch<SetStateAction<string | null>>;
  pierFacilityId: string | null;
  setPierFacilityId: Dispatch<SetStateAction<string | null>>;

  howDidYouHearAboutUs: string;
  setHowDidYouHearAboutUs: Dispatch<SetStateAction<string>>;

  mergeOnboardingState: (state: RecursivePartial<SharedOnboardingState>) => void;
  redirectToGenericErrorPage: () => Promise<boolean>;
}

interface OnboardingOperationsMap {
  userCreated: boolean;
  userAddressCreated: boolean;
  userIdentityBasisCreated: boolean;
  userTaxInfoIsSet: boolean;
  bankAccountCreated: boolean;
  kycSubmitted: boolean;
  locSubmitted: boolean;
  locActivated: boolean;
  pierBorrowerCreated: boolean;
  pierApplicationCreated: boolean;
  underwritingSucceeded: boolean;
  pierApplicationApproved: boolean;
  pierLoanAgreementCreated: boolean;
  pierLoanAgreementSigned: boolean;
  pierFacilityCreated: boolean;
  onboardingCompleted: boolean;
}

type PlaidPayload = null | { publicToken: string; metadata: PlaidLinkOnSuccessMetadata };

const onboardingContext = createContext<IOnboardingContext>(null as any);

export const OnboardingProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const { push } = useRouter();
  const [onboardingOperationsMap, setOnboardingOperationsMap] = useState<OnboardingOperationsMap>({
    userCreated: false,
    userAddressCreated: false,
    userIdentityBasisCreated: false,
    userTaxInfoIsSet: false,
    bankAccountCreated: false,
    kycSubmitted: false,
    locSubmitted: false,
    locActivated: false,
    pierBorrowerCreated: false,
    pierApplicationCreated: false,
    underwritingSucceeded: false,
    pierApplicationApproved: false,
    pierLoanAgreementCreated: false,
    pierLoanAgreementSigned: false,
    pierFacilityCreated: false,
    onboardingCompleted: false,
  });
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("WELCOME");

  const [isUserBlocked, setIsUserBlocked] = useState(false);

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

  const [locId, setLocId] = useState("");

  const [pierBorrowerId, setPierBorrowerId] = useState<IOnboardingContext["pierBorrowerId"]>(null);
  const [pierApplicationId, setPierApplicationId] =
    useState<IOnboardingContext["pierApplicationId"]>(null);
  const [pierLoanAgreementDocumentUrl, setPierLoanAgreementDocumentUrl] =
    useState<IOnboardingContext["pierLoanAgreementDocumentUrl"]>(null);
  const [pierLoanAgreementId, setPierLoanAgreementId] =
    useState<IOnboardingContext["pierLoanAgreementId"]>(null);
  const [pierFacilityId, setPierFacilityId] = useState<IOnboardingContext["pierFacilityId"]>(null);

  const [howDidYouHearAboutUs, setHowDidYouHearAboutUs] = useState("");

  const mergeOnboardingState = useCallback(
    (state: RecursivePartial<SharedOnboardingState>) => {
      if (state.onboardingOperationsMap)
        setOnboardingOperationsMap((p) => ({ ...p, ...state.onboardingOperationsMap }));
      if (state.onboardingStep) setOnboardingStep(state.onboardingStep);

      if (state.firstName) setFirstName(state.firstName);
      if (state.lastName) setLastName(state.lastName);
      if (state.phone) setPhone(state.phone);
      if (state.email) setEmail(state.email);

      if (state.plan) setPlan(state.plan);
      if (state.user) setUser((p) => ({ ...p, ...(state.user as GCUser) }));

      if (state.dateOfBirth) setDateOfBirth(new Date(state.dateOfBirth as Date | string));
      if (state.legalAddress) setLegalAddress(state.legalAddress);
      if (state.aptNumber) setAptNumber(state.aptNumber);
      if (state.city) setCity(state.city);
      if (state.state) setState(state.state);
      if (state.zipCode) setZipCode(state.zipCode);
      if (state.ssn) setSsn(state.ssn);
      if (state.agreedToCardHolderAgreement)
        setAgreedToCardHolderAgreement(state.agreedToCardHolderAgreement);
      if (state.agreedToAutopay) setAgreedToAutopay(state.agreedToAutopay);
      if (state.agreedToTermsOfService) setAgreedToTermsOfService(state.agreedToTermsOfService);

      if (state.plaid) setPlaid((p) => ({ ...p, ...(state.plaid as any) }));
      if (state.locId) setLocId(state.locId);

      if (state.pierBorrowerId) setPierBorrowerId(state.pierBorrowerId);
      if (state.pierApplicationId) setPierApplicationId(state.pierApplicationId);
      if (state.pierLoanAgreementId) setPierLoanAgreementId(state.pierLoanAgreementId);
      if (state.pierLoanAgreementDocumentUrl)
        setPierLoanAgreementDocumentUrl(state.pierLoanAgreementDocumentUrl);
      if (state.pierFacilityId) setPierFacilityId(state.pierFacilityId);
      if (state.howDidYouHearAboutUs) setHowDidYouHearAboutUs(state.howDidYouHearAboutUs);
    },
    [
      setOnboardingOperationsMap,
      setOnboardingStep,
      setFirstName,
      setLastName,
      setPhone,
      setEmail,
      setPlan,
      setUser,
      setDateOfBirth,
      setLegalAddress,
      setAptNumber,
      setCity,
      setState,
      setZipCode,
      setSsn,
      setAgreedToCardHolderAgreement,
      setAgreedToAutopay,
      setAgreedToTermsOfService,
      setPlaid,
      setLocId,
      setPierBorrowerId,
      setPierApplicationId,
      setPierLoanAgreementId,
      setPierLoanAgreementDocumentUrl,
      setPierFacilityId,
      setHowDidYouHearAboutUs,
    ]
  );

  const redirectToGenericErrorPage = useCallback(
    () => push("/onboarding/something-went-wrong"),
    [push]
  );

  return (
    <onboardingContext.Provider
      value={{
        onboardingOperationsMap,
        setOnboardingOperationsMap,
        onboardingStep,
        setOnboardingStep,

        isUserBlocked,
        setIsUserBlocked,

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
        locId,
        setLocId,

        pierBorrowerId,
        setPierBorrowerId,
        pierApplicationId,
        setPierApplicationId,
        pierLoanAgreementId,
        setPierLoanAgreementId,
        pierLoanAgreementDocumentUrl,
        setPierLoanAgreementDocumentUrl,
        pierFacilityId,
        setPierFacilityId,

        howDidYouHearAboutUs,
        setHowDidYouHearAboutUs,

        mergeOnboardingState,
        redirectToGenericErrorPage,
      }}
    >
      {children}
    </onboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(onboardingContext);
