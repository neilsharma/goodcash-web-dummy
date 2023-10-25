import type { FC } from "react";
import type { IconProps } from ".";

export const Cart: FC<IconProps> = ({ iconColor = "black", ...props }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_2946_1584)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.999939 2.25012C0.999939 1.55977 1.55958 1.00012 2.24994 1.00012H4.20228C6.4139 1.00012 8.27521 2.74684 8.27521 4.98462V11.3171C8.27521 12.0997 8.94164 12.8016 9.84814 12.8016H18.1096C18.8158 12.8016 19.4074 12.3631 19.6085 11.7667L20.7489 8.38461C21.0537 7.48086 20.3721 6.45049 19.25 6.45049H10.6067C9.91631 6.45049 9.35667 5.89084 9.35667 5.20049C9.35667 4.51013 9.91631 3.95049 10.6067 3.95049H19.25C21.9672 3.95049 24.0052 6.55196 23.1179 9.18341L21.9775 12.5655C21.4201 14.2183 19.8461 15.3016 18.1096 15.3016H9.84814C7.63653 15.3016 5.77521 13.5549 5.77521 11.3171V4.98462C5.77521 4.20196 5.10879 3.50012 4.20228 3.50012H2.24994C1.55958 3.50012 0.999939 2.94048 0.999939 2.25012ZM14.897 20.3664C14.897 18.8573 16.1201 17.632 17.6315 17.632C19.1428 17.632 20.366 18.8573 20.366 20.3664C20.366 21.8755 19.1428 23.1009 17.6315 23.1009C16.1201 23.1009 14.897 21.8755 14.897 20.3664ZM9.42799 17.632C7.91665 17.632 6.69349 18.8573 6.69349 20.3664C6.69349 21.8755 7.91665 23.1009 9.42799 23.1009C10.9393 23.1009 12.1625 21.8755 12.1625 20.3664C12.1625 18.8573 10.9393 17.632 9.42799 17.632Z"
        fill={iconColor}
      />
    </g>
    <defs>
      <clipPath id="clip0_2946_1584">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default Cart;
