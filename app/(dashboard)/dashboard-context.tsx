"use client";

import { GCUser } from "@/shared/http/types";
import React, { FC, ReactNode, createContext, useContext } from "react";

export type IDashboardContext = {
  gcUser: { [key: string]: any } & GCUser;
};

export const dashboardContext = createContext<IDashboardContext>(null as any);

export const DashboardProvider: FC<{ children?: ReactNode; gcUser: GCUser }> = ({
  children,
  gcUser,
}) => {
  return <dashboardContext.Provider value={{ gcUser }}>{children}</dashboardContext.Provider>;
};

export const useDashboardContext = () => useContext(dashboardContext);
