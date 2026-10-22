"use client";

import { createContext, useContext } from "react";
import type { SiteContent } from "@/content";
import type { Action, Permissions } from "@/lib/cms-access";
import type { Path } from "../../admin/_components/lib";

export interface CmsUserInfo {
  id: string;
  name: string;
  email: string;
  username?: string;
  roleId: string;
  roleName: string;
  /** The administrator from the environment (the same sign-in as /admin). */
  root: boolean;
}

export interface CmsContextValue {
  user: CmsUserInfo;
  permissions: Permissions;
  superUser: boolean;
  can: (resource: string, action: Action) => boolean;
  storage: "redis" | "file" | "none";

  content: SiteContent;
  update: (path: Path, value: unknown) => void;
  isDirty: (moduleId: string) => boolean;
  anyDirty: boolean;
  savePage: (moduleId: string) => Promise<boolean>;
  discardPage: (moduleId: string) => void;
  savingModule: string | null;
  attempt: number;
  /** Replaces everything after a version was restored. */
  replaceAll: (content: SiteContent) => void;
  savedTick: number;
  signOut: () => Promise<void>;
}

export const CmsContext = createContext<CmsContextValue | null>(null);

export function useCms(): CmsContextValue {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used inside the panel");
  return ctx;
}
