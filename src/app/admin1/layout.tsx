import type { Metadata } from "next";
import adminStyles from "../admin/admin.module.css";
import cms from "./cms.module.css";

export const metadata: Metadata = {
  title: { absolute: "Dashboard | Recenturesoft" },
  description: "Manage the Recenturesoft website.",
  robots: { index: false, follow: false, nocache: true },
};

export default function Admin1Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${adminStyles.root} ${cms.skin}`}>{children}</div>;
}
