import type { FC } from "react";
import ReactSelect, { Props } from "react-select";
import {
  FormControlDescription,
  FormControlError,
  FormControlLabel,
  FormControlWrapper,
  getInputClassName,
  isError,
  SharedFormControlProps,
} from "./shared";

export interface FormControlSelectProps extends SharedFormControlProps, Props {}

export const FormControlSelect: FC<FormControlSelectProps> = ({
  label,
  labelDescription,
  description,
  containerProps,
  className,
  error,
  ...props
}) => {
  return (
    <FormControlWrapper {...containerProps}>
      <FormControlLabel label={label} labelDescription={labelDescription} />
      <ReactSelect {...props} className={getInputClassName(className, isError(error))} />
      <FormControlDescription description={description} />
      <FormControlError error={error} />
    </FormControlWrapper>
  );
};

export default FormControlSelect;
