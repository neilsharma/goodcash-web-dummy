import type { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export type TitleProps = DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

export const Title: FC<TitleProps> = ({ className, children, ...props }) => {
  return (
    <h1
      className={twMerge("font-kansasNewSemiBold text-4xl mb-4 text-boldText", className)}
      {...props}
    >
      {children}
    </h1>
  );
};

export default Title;
