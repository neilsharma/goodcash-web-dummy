import { DetailedHTMLProps, FC, InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export interface FormControlProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
}

export const FormControl: FC<FormControlProps> = ({
  label,
  className,
  ...props
}) => {
  return (
    <div className="w-full my-7">
      <label>
        {label && (
          <span className="my-3 block text-text font-sharpGroteskMedium text-sm">
            {label}
          </span>
        )}
        <input
          className={twMerge(
            "w-full p-4 rounded-lg border border-black/20 font-sharpGroteskBook",
            className
          )}
          type="text"
          {...props}
        />
      </label>
    </div>
  );
};

export default FormControl;
