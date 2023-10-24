"use client";

import type { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";
import { twMerge } from "tailwind-merge";
import Loader from "./Loader";
import { ETrackEvent, IGCAnalyticsData } from "../utils/types";
import { trackEvent } from "../utils/analytics/analytics";

export interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: "contained" | "text";
  isLoading?: boolean;
  analytics?: {
    event: ETrackEvent;
    options?: IGCAnalyticsData;
  };
}

export const Button: FC<ButtonProps> = ({
  className,
  isLoading = false,
  variant = "contained",
  analytics,
  onClick,
  disabled,
  children,
  ...props
}) => {
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
      disabled={isLoading || disabled}
      onClick={(...agrs) => {
        analytics ? trackEvent(analytics) : null;
        onClick ? onClick(...agrs) : null;
      }}
    >
      {isLoading ? (
        <Loader className="z-10 p-0" svgProps={{ className: "w-6 h-6 fill-white" }} />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
