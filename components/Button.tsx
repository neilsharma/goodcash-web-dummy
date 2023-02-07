import type { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";
import { twMerge } from "tailwind-merge";

export interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: "contained" | "text";
}

export const Button: FC<ButtonProps> = ({ className, variant = "contained", ...props }) => {
  return (
    <button
      className={twMerge(
        "w-full rounded-lg font-kansasNewMedium p-3 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-200 block",
        variant === "contained" ? "bg-primary" : "bg-transparent",
        variant === "contained" ? "text-white" : "text-primary",
        className
      )}
      {...props}
    />
  );
};

export default Button;
