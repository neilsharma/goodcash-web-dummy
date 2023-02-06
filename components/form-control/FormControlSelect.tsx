import type { FC } from "react";
import ReactSelect, { Props } from "react-select";
import { twMerge } from "tailwind-merge";
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
      <ReactSelect
        {...props}
        classNames={{
          control: () => getInputClassName(twMerge(className, "p-0", "pl-1"), isError(error)),
        }}
      />
      <FormControlDescription description={description} />
      <FormControlError error={error} />
    </FormControlWrapper>
  );
};

export default FormControlSelect;
