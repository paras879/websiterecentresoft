import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { adminStatus, isAuthenticatedAdmin } from "@/lib/admin-auth";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  if (await isAuthenticatedAdmin()) redirect("/admin");
  const status = await adminStatus();
  return <LoginForm ready={status.configured && status.secretOk} missingSecret={!status.secretOk} missingPassword={!status.configured} />;
}
