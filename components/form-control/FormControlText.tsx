import { DetailedHTMLProps, FC, InputHTMLAttributes, createElement } from "react";
import InputMask, { Props } from "react-input-mask";
import {
  FormControlDescription,
  FormControlError,
  FormControlLabel,
  FormControlWrapper,
  getInputClassName,
  isError,
  SharedFormControlProps,
} from "./shared";

type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
  Omit<Partial<Props>, "mask">;

export interface FormControlTextProps extends SharedFormControlProps, InputProps {
  inputMask?: Props["mask"];
}

export const FormControlText: FC<FormControlTextProps> = ({
  label,
  labelDescription,
  description,
  containerProps,
  className,
  inputMask,
  error,
  ...props
}) => {
  const inputProps: InputProps & Record<string, any> = {
    className: getInputClassName(className, isError(error)),
    mask: inputMask,
    type: "text",
    ...props,
  };

  return (
    <FormControlWrapper {...containerProps}>
      <FormControlLabel label={label} labelDescription={labelDescription} />
      {createElement(inputMask ? InputMask : "input", inputProps as any)}
      <FormControlDescription description={description} />
      <FormControlError error={error} />
    </FormControlWrapper>
  );
};

export default FormControlText;
