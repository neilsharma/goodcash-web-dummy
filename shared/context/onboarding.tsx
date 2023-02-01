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
  testValue: boolean;
  setTestValue: Dispatch<SetStateAction<boolean>>;
}

const onboardingContext = createContext<IOnboardingContext>({
  testValue: false,
  setTestValue: () => {},
});

export const OnboardingProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [val, setVal] = useState(false);

  return (
    <onboardingContext.Provider
      value={{ testValue: val, setTestValue: setVal }}
    >
      {children}
    </onboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(onboardingContext);
