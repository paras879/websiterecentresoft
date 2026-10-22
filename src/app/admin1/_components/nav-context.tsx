"use client";

import { createContext, useContext } from "react";
import Link from "next/link";

/** Screens that more than one admin panel shows. Each panel says how to reach them (its own addresses). */
export type NavRoute =
  | { name: "users" }
  | { name: "user"; id: string }
  | { name: "roles" }
  | { name: "role"; id: string }
  | { name: "pages" }
  | { name: "page"; id: string }
  | { name: "activity" };

export interface NavValue {
  kind: "next" | "hash";
  href: (route: NavRoute) => string;
  go: (route: NavRoute) => void;
  /** Address of the live preview for a page. */
  preview: (id: string) => string;
}

export const NavContext = createContext<NavValue | null>(null);

export function useNav(): NavValue {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used inside an admin panel");
  return ctx;
}

/** A link to one of the shared screens. */
export function NavLink({ to, className, children, ...rest }: { to: NavRoute; className?: string; children: React.ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const nav = useNav();
  const href = nav.href(to);
  if (nav.kind === "next") {
    return (
      <Link href={href} className={className} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}
