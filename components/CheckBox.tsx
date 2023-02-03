import {
  DetailedHTMLProps,
  FC,
  InputHTMLAttributes,
  LabelHTMLAttributes,
} from "react";
import { twMerge } from "tailwind-merge";

export interface CheckBoxProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  containerProps?: DetailedHTMLProps<
    LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >;
}

export const CheckBox: FC<CheckBoxProps> = ({
  containerProps,
  children,
  ...props
}) => {
  return (
    <label
      {...containerProps}
      className={twMerge(
        "flex gap-3 items-start cursor-pointer my-6",
        containerProps?.className
      )}
    >
      <input
        {...props}
        type="checkbox"
        className={twMerge("h-5 w-5", containerProps?.className)}
      />
      <span className="font-sharpGroteskBook text-thinText text-sm">
        {children}
      </span>
    </label>
  );
};

export default CheckBox;
