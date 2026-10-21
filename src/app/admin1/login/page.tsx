import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { adminStatus } from "@/lib/admin-auth";
import { getCmsUser } from "@/lib/cms-auth";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Login | Recenturesoft" },
  robots: { index: false, follow: false },
};

export default async function Admin1LoginPage() {
  if (await getCmsUser()) redirect("/admin1");
  const status = await adminStatus();
  return <LoginForm missingSecret={!status.secretOk} />;
}
