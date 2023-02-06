import {
  DetailedHTMLProps,
  FC,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  createElement,
} from "react";
import Image from "next/image";
import InputMask from "react-input-mask";
import { twMerge } from "tailwind-merge";

type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export interface FormControlProps extends InputProps {
  label?: string;
  labelDescription?: string;
  description?: string;
  inputMask?: string;
  error?: boolean | string | null;
  containerProps?: DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
}

export const FormControl: FC<FormControlProps> = ({
  label,
  labelDescription,
  description,
  containerProps,
  className,
  inputMask,
  error,
  ...props
}) => {
  const isError = !!error || typeof error === "string";

  const inputProps: InputProps & Record<string, any> = {
    className: twMerge(
      `w-full p-4 rounded-lg font-sharpGroteskBook border border-${
        isError ? "error" : "black/20"
      } outline-${isError ? "error" : "inherit"}`,
      className
    ),
    mask: inputMask,
    type: "text",
    ...props,
  };

  return (
    <label {...containerProps} className={twMerge("w-full my-7 block", containerProps?.className)}>
      {label && (
        <div className="my-3 flex justify-between">
          <span className="text-text font-sharpGroteskMedium text-sm">{label}</span>
          {labelDescription && (
            <span className="text-xs text-thinText sm:text-sm">{labelDescription}</span>
          )}
        </div>
      )}
      {createElement(inputMask ? InputMask : "input", inputProps as any)}
      {description && <span className="block mt-3 text-sm text-thinText">{description}</span>}
      {typeof error === "string" && (
        <div className="flex mt-2 gap-2 items-end">
          <Image src="/img/logo/alert.svg" alt="alert" width={24} height={24} priority={true} />
          <span className="block text-sm text-error">{error}</span>
        </div>
      )}
    </label>
  );
};

export default FormControl;
