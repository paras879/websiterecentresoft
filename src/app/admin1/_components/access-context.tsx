"use client";

import { createContext, useContext } from "react";
import type { Action, Permissions } from "@/lib/cms-access";
import type { CmsUserInfo } from "./cms-context";

/** Who is signed in and what they may do. Shared by both admin panels. */
export interface AccessValue {
  user: CmsUserInfo;
  permissions: Permissions;
  superUser: boolean;
  can: (resource: string, action: Action) => boolean;
}

export const AccessContext = createContext<AccessValue | null>(null);

export function useAccess(): AccessValue {
  const ctx = useContext(AccessContext);
  if (!ctx) throw new Error("useAccess must be used inside an admin panel");
  return ctx;
}
