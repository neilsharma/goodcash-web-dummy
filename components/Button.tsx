import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";
import { twMerge } from "tailwind-merge";

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

export const Button: FC<ButtonProps> = ({ className, ...props }) => {
  return (
    <button
      className={twMerge(
        "w-full rounded-lg bg-primary text-white font-kansasNewMedium p-3",
        className
      )}
      {...props}
    />
  );
};

export default Button;
