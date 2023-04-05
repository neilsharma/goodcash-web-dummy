import { AxiosError } from "axios";

export const parseApiError = (error: AxiosError<{ message?: string }>) => {
  const message = error?.response?.data.message;

  const data: ErrorObject | null = message ? attemptParse(message) : null;

  return data;
};

const attemptParse = (jsonString: string | object): ErrorObject | null => {
  if (typeof jsonString === "object") return jsonString as ErrorObject;

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
};

interface ErrorObject {
  [key: string]: any;
  errorCode: string;
  errorInfo: string;
  message?: string;
}
