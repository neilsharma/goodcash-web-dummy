import type { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";
import { twMerge } from "tailwind-merge";
import Loader from "./Loader";

export interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: "contained" | "text";
  isLoading?: boolean;
}

export const Button: FC<ButtonProps> = ({
  className,
  isLoading = false,
  variant = "contained",
  ...props
}) => {
  if (isLoading) return <Loader />;

  return (
    <button
      className={twMerge(
        "w-full rounded-lg font-kansasNewMedium p-3 disabled:cursor-not-allowed  block",
        variant === "contained"
          ? "text-white bg-primary disabled:bg-gray-400 disabled:text-gray-200"
          : "text-primary bg-transparent disabled:text-gray-400",
        className
      )}
      {...props}
    />
  );
};

export default Button;
