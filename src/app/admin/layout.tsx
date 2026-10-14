import type { Metadata } from "next";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: { absolute: "Admin | Recenturesoft" },
  description: "Manage the Recenturesoft website.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.root}>{children}</div>;
}
