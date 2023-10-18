export const verifyState: { code: string; codeMask: string; isOtpInvalid: boolean } = {
  code: "",
  codeMask: "",
  isOtpInvalid: false,
};

export const verifyReducer = (
  state: { code: string; codeMask: string; isOtpInvalid: boolean },
  action: {
    type: "code" | "codeMask" | "isOtpInvalid";
    payload?: any;
  }
) => {
  switch (action.type) {
    case "code":
      return {
        ...state,
        code: action.payload,
      };
    case "codeMask":
      return {
        ...state,
        codeMask: action.payload,
      };
    case "isOtpInvalid":
      return {
        ...state,
        isOtpInvalid: action.payload,
      };
    default:
      return state;
  }
};
