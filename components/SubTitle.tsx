import type { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export type SubTitleProps = DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;

export const SubTitle: FC<SubTitleProps> = ({ className, children, ...props }) => {
  return (
    <p className={twMerge("font-sharpGroteskBook text-lg", className)} {...props}>
      {children}
    </p>
  );
};

export default SubTitle;
