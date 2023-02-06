import { DetailedHTMLProps, FC, LabelHTMLAttributes, HTMLAttributes } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

type ContainerProps = DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;

export interface SharedFormControlProps {
  label?: string;
  labelDescription?: string;
  description?: string;
  error?: boolean | string | null;
  containerProps?: ContainerProps;
}

export const isError = (error: SharedFormControlProps["error"]) =>
  !!error || typeof error === "string";

export const getInputClassName = (
  className: HTMLAttributes<HTMLInputElement>["className"],
  isError: boolean
) => {
  return twMerge(
    `w-full p-4 rounded-lg font-sharpGroteskBook border border-${
      isError ? "error" : "black/20"
    } outline-${isError ? "error" : "inherit"}`,
    className
  );
};

export const FormControlWrapper: FC<
  DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>
> = ({ className, ...props }) => (
  <label {...props} className={twMerge("w-full my-7 block", className)} />
);

export const FormControlLabel: FC<{ label?: string; labelDescription?: string }> = ({
  label,
  labelDescription,
}) => {
  return label ? (
    <div className="my-3 flex justify-between">
      <span className="text-text font-sharpGroteskMedium text-sm">{label}</span>
      {labelDescription && (
        <span className="text-xs text-thinText sm:text-sm">{labelDescription}</span>
      )}
    </div>
  ) : null;
};

export const FormControlDescription: FC<{ description?: string }> = ({ description }) =>
  description ? <span className="block mt-3 text-sm text-thinText">{description}</span> : null;

export const FormControlError: FC<{ error?: string | boolean | null }> = ({ error }) =>
  typeof error === "string" ? (
    <div className="flex mt-2 gap-2 items-end">
      <Image src="/img/logo/alert.svg" alt="alert" width={24} height={24} priority={true} />
      <span className="block text-sm text-error">{error}</span>
    </div>
  ) : null;
