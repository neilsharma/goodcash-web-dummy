import { FC } from "react";
import type { IconProps } from ".";

const Profile: FC<IconProps> = ({ iconColor = "black", ...props }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_1_967)">
      <circle cx="12" cy="12" r="10.75" stroke={iconColor} strokeWidth="2.5" />
      <path
        d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z"
        stroke={iconColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <mask
        id="mask0_1_967"
        // style="mask-type:alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <circle cx="12" cy="12" r="12" fill="#C4C4C4" />
      </mask>
      <g mask="url(#mask0_1_967)">
        <rect x="6" y="16" width="12" height="11" rx="4" stroke={iconColor} strokeWidth="2.5" />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_1_967">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default Profile;
