"use client";

import type { FC } from "react";
import { useDashboardContext } from "../dashboard-context";

export const UserName: FC = () => {
  const { gcUser } = useDashboardContext();

  return gcUser.contactInfo?.firstName;
};
