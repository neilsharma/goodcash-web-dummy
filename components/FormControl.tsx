import type { DetailedHTMLProps, FC, InputHTMLAttributes, LabelHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export interface FormControlProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: string;
  labelDescription?: string;
  description?: string;
  containerProps?: DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
}

export const FormControl: FC<FormControlProps> = ({
  label,
  labelDescription,
  description,
  containerProps,
  className,
  ...props
}) => {
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
      <input
        className={twMerge(
          "w-full p-4 rounded-lg border border-black/20 font-sharpGroteskBook",
          className
        )}
        type="text"
        {...props}
      />
      {description && <span className="block mt-3 text-sm text-thinText">{description}</span>}
    </label>
  );
};

export default FormControl;
