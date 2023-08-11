import { useRouter } from "next/router";
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { PlaidLinkOnSuccessMetadata } from "react-plaid-link";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import { GCUser, UserStateCoverageMap } from "../http/types";
import {
  EStepStatus,
  EUsaStates,
  OnboardingStep,
  OnboardingSteps,
  RecursivePartial,
  SharedOnboardingState,
} from "../types";
import { init } from "../feature";
import { getUserStateCoverageMap } from "../http/services/loanAgreements";
import { getUserInfoFromCache, navigateWithQuery } from "../http/util";
import { onboardingStepToPageMap } from "../constants";
import { getUserOnboarding, getUserOnboardingVersion } from "../http/services/user";
import { app } from "./global";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useConfirmIsOAuthRedirect } from "../hooks";

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

  loanAgreementDocumentUrl: string | null;
  setLoanAgreementDocumentUrl: Dispatch<SetStateAction<string | null>>;
  howDidYouHearAboutUs: string;
  setHowDidYouHearAboutUs: Dispatch<SetStateAction<string>>;

  mergeOnboardingState: (state: RecursivePartial<SharedOnboardingState>) => void;
  redirectToGenericErrorPage: () => Promise<boolean>;
  redirectToStateNotSupportedPage: () => Promise<boolean>;
  redirectToNotEnoughMoneyPage: () => Promise<boolean>;
  userStateCoverageMap: UserStateCoverageMap | null;
  onboardingStepState: object;
  onboardingStepHandler: (status: EStepStatus) => void;
  currentOnboardingStep: string;
  version: number;
  setVersion: Dispatch<SetStateAction<number>>;
  updateOnboardingStepData: (onboardingData?: OnboardingOperationsMap) => void;
  isLoadingUserInfo: boolean;
  mergeOnboardingStateHandler: (token: string) => Promise<void>;
}

export interface OnboardingOperationsMap {
  userCreated: boolean;
  userAddressCreated: boolean;
  userIdentityBasisCreated: boolean;
  userTaxInfoIsSet: boolean;
  userKycFilled: boolean;
  userKycSubmitted: boolean;
  bankAccountCreated: boolean;

  loanApplicationCreated: boolean;
  loanApplicationApproved: boolean;
  loanAgreementCreated: boolean;
  loanAgreementCompleted: boolean;

  underwritingSucceeded: boolean;
  onboardingCompleted: boolean;
}

type PlaidPayload = null | { publicToken: string; metadata: PlaidLinkOnSuccessMetadata };

const onboardingContext = createContext<IOnboardingContext>(null as any);

export const OnboardingProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const { push, query, pathname } = useRouter();
  const [onboardingOperationsMap, setOnboardingOperationsMap] = useState<OnboardingOperationsMap>({
    userCreated: false,
    userAddressCreated: false,
    userIdentityBasisCreated: false,
    userTaxInfoIsSet: false,
    userKycFilled: false,
    userKycSubmitted: false,
    bankAccountCreated: false,

    loanApplicationCreated: false,
    loanApplicationApproved: false,
    loanAgreementCreated: false,
    loanAgreementCompleted: false,

    underwritingSucceeded: false,
    onboardingCompleted: false,
  });
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("USER_IDENTITY_COLLECTION");

  const [isUserBlocked, setIsUserBlocked] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<EUsaStates | "">("");
  const [userStateCoverageMap, setUserStateCoverageMap] = useState<UserStateCoverageMap | null>(
    null
  );

  useEffect(() => {
    const cachedUserInfo = getUserInfoFromCache();
    if (cachedUserInfo && !phone && !email && !state) {
      setPhone(cachedUserInfo.phone);
      setEmail(cachedUserInfo.email);
      setState(EUsaStates[cachedUserInfo.state as keyof typeof EUsaStates]);
    }
  }, [email, phone, setEmail, setPhone, setState, state]);

  const indexPageIsValid = useMemo(() => {
    return !!(isMobilePhone(phone, "en-US", { strictMode: true }) && isEmail(email) && state);
  }, [phone, email, state]);

  const [phoneVerified, setPhoneVerified] = useState(false);

  const [plan, setPlan] = useState<string | null>(null);

  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [legalAddress, setLegalAddress] = useState("");
  const [aptNumber, setAptNumber] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [ssn, setSsn] = useState("");
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);

  const [agreedToCardHolderAgreement, setAgreedToCardHolderAgreement] = useState(false);
  const [agreedToAutopay, setAgreedToAutopay] = useState(false);
  const [agreedToTermsOfService, setAgreedToTermsOfService] = useState(false);
  const [currentOnboardingStep, setCurrentOnboardingStep] =
    useState<string>("BANK_ACCOUNT_LINKING");
  const [version, setVersion] = useState<number>(0);

  const onboardingStepState = useMemo(
    () => ({
      BANK_ACCOUNT_LINKING: {
        status: "NOT_STARTED",
        metadata: {},
      },
      BANK_ACCOUNT_VERIFICATION: {
        status: "NOT_STARTED",
        metadata: {},
      },
      LOAN_APPLICATION_SUBMISSION: {
        status: "NOT_STARTED",
        metadata: {},
      },
      LOAN_AGREEMENT_CREATION: {
        status: "NOT_STARTED",
        metadata: {},
      },
      REFERRAL_SOURCE: {
        status: "NOT_STARTED",
        metadata: {},
      },
      APP_DOWNLOAD: {
        status: "NOT_STARTED",
        metadata: {},
      },
    }),
    []
  );

  const updateOnboardingStepData = useCallback(
    (onboardingData?: OnboardingOperationsMap) => {
      if (onboardingData) {
        for (const stepKey in onboardingStepState) {
          if (onboardingData.bankAccountCreated && stepKey === "BANK_ACCOUNT_LINKING") {
            onboardingStepState[stepKey as keyof typeof onboardingStepState].status = "COMPLETED";
          }
          if (onboardingData.loanApplicationApproved && stepKey === "BANK_ACCOUNT_VERIFICATION") {
            onboardingStepState[stepKey as keyof typeof onboardingStepState].status = "COMPLETED";
          }
          if (onboardingData.loanAgreementCompleted && stepKey === "LOAN_APPLICATION_SUBMISSION") {
            onboardingStepState[stepKey as keyof typeof onboardingStepState].status = "COMPLETED";
          }
          if (onboardingData.loanAgreementCompleted && stepKey === "LOAN_AGREEMENT_CREATION") {
            onboardingStepState[stepKey as keyof typeof onboardingStepState].status = "COMPLETED";
          }
          if (onboardingData.onboardingCompleted && stepKey === "REFERRAL_SOURCE") {
            onboardingStepState[stepKey as keyof typeof onboardingStepState].status = "COMPLETED";
          }
        }
      }
    },
    [onboardingStepState]
  );

  const updateTheOnboardingStepMapData = useCallback(
    (status: EStepStatus) => {
      const oldData =
        onboardingStepState[currentOnboardingStep as keyof typeof onboardingStepState];
      if (oldData) {
        onboardingStepState[currentOnboardingStep as keyof typeof onboardingStepState].status =
          status;
      }
    },
    [currentOnboardingStep, onboardingStepState]
  );

  const redirectToNextOnboardingStep = useCallback(
    (step: string) => {
      const urlWithQuery = navigateWithQuery(query, `/onboarding/${version}/${step}`);
      push(urlWithQuery).finally(() => setIsLoadingUserInfo(false));
    },
    [push, query, version]
  );

  const redirectToGenericErrorPage = useCallback(
    () => push(`/onboarding/something-went-wrong`),
    [push]
  );

  const redirectToStateNotSupportedPage = useCallback(
    () => push(`/onboarding/state-not-supported`),
    [push]
  );

  const redirectToNotEnoughMoneyPage = useCallback(
    () => push(`/onboarding/${version}/not-enough-money`),
    [push, version]
  );

  const onboardingStepHandler = useCallback(
    (status: EStepStatus) => {
      updateTheOnboardingStepMapData(status);
      for (const stepKey in onboardingStepState) {
        if (status === EStepStatus.FAILED) {
          return redirectToGenericErrorPage();
        }
        const value = onboardingStepState[stepKey as keyof typeof onboardingStepState];
        if (value.status === "NOT_STARTED" || value.status === "IN_PROGRESS") {
          const firstNotStartedStep = stepKey as OnboardingStep;
          onboardingStepState[stepKey as keyof typeof onboardingStepState].status = "IN_PROGRESS";
          setCurrentOnboardingStep(stepKey);
          redirectToNextOnboardingStep(
            onboardingStepToPageMap[firstNotStartedStep as OnboardingStep]
          );
          break;
        }
      }
    },
    [
      onboardingStepState,
      redirectToGenericErrorPage,
      redirectToNextOnboardingStep,
      updateTheOnboardingStepMapData,
    ]
  );

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

  const [loanAgreementDocumentUrl, setLoanAgreementDocumentUrl] =
    useState<IOnboardingContext["loanAgreementDocumentUrl"]>(null);
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
      if (state.user) {
        setUser((p) => ({ ...p, ...(state.user as GCUser) }));
        init(state.user.id!);
      }

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

      if (state.loanAgreementDocumentUrl)
        setLoanAgreementDocumentUrl(state.loanAgreementDocumentUrl);
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
      setLoanAgreementDocumentUrl,
      setHowDidYouHearAboutUs,
    ]
  );

  const redirectToOnboardingIfUserNotFound = () => {
    const urlWithQuery = navigateWithQuery(query, onboardingStepToPageMap.USER_IDENTITY_COLLECTION);
    if (pathname !== "/onboarding") {
      push(urlWithQuery);
    }
  };

  const isPlaidOAuthRedirect = useConfirmIsOAuthRedirect();

  const mergeOnboardingStateHandler = async (token: string) => {
    setIsLoadingUserInfo(true);
    try {
      const userOnboardingVersion = await getUserOnboardingVersion(token);
      if (userOnboardingVersion?.version !== undefined) {
        setVersion(userOnboardingVersion.version);
      }
      const onboardingStatePromise = getUserOnboarding(token).catch(() => null);
      const onboardingState = await onboardingStatePromise;
      if (onboardingState) {
        mergeOnboardingState(onboardingState);
        updateOnboardingStepData(
          onboardingState.onboardingOperationsMap as OnboardingOperationsMap
        );
        if (
          onboardingState.onboardingOperationsMap?.userKycSubmitted ||
          onboardingState.onboardingOperationsMap?.userTaxInfoIsSet ||
          isPlaidOAuthRedirect
        ) {
          setCurrentOnboardingStep("BANK_ACCOUNT_LINKING");
          onboardingStepHandler(EStepStatus.IN_PROGRESS);
        } else {
          setIsLoadingUserInfo(false);
        }
      }
    } catch (error) {
      setIsLoadingUserInfo(false);
      redirectToOnboardingIfUserNotFound();
    }
  };

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((token) => {
          mergeOnboardingStateHandler(token);
        });
      } else {
        redirectToOnboardingIfUserNotFound();
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async function () {
      try {
        const userStateCoverage = await getUserStateCoverageMap();
        if (userStateCoverage) {
          setUserStateCoverageMap(userStateCoverage);
        }
      } catch (error) {
        setUserStateCoverageMap(null);
      }
    })();
  }, []);

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

        loanAgreementDocumentUrl,
        setLoanAgreementDocumentUrl,

        howDidYouHearAboutUs,
        setHowDidYouHearAboutUs,

        mergeOnboardingState,
        redirectToGenericErrorPage,
        redirectToStateNotSupportedPage,
        redirectToNotEnoughMoneyPage,
        userStateCoverageMap,
        onboardingStepState,
        onboardingStepHandler,
        currentOnboardingStep,
        version,
        setVersion,
        updateOnboardingStepData,
        isLoadingUserInfo,
        mergeOnboardingStateHandler,
      }}
    >
      {children}
    </onboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(onboardingContext);
