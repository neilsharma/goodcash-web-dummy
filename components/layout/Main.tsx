import type { FC } from "react";

export const Main: FC<{ children: React.ReactNode }> = ({ children }) => (
  <main className="max-w-[500px] px-6 box-content m-auto h-auto">{children}</main>
);
