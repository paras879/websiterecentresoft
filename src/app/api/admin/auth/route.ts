import {
  adminStatus,
  clearAdminSession,
  clientIp,
  createAdminSession,
  renewAdminSession,
  isAuthenticatedAdmin,
  sameOrigin,
  verifyLogin,
  resetRateLimit,
  withinRateLimit,
} from "@/lib/admin-auth";
import { logAudit } from "@/lib/audit";
import { failure, json } from "@/lib/api";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { getStore } from "@/lib/store";

export async function GET() {
  const [authenticated, status] = await Promise.all([isAuthenticatedAdmin(), adminStatus()]);
  return json({ success: true, authenticated, ...status, storage: getStore().kind });
}

export async function POST(req: Request) {
  if (!(await sameOrigin(req))) return json({ success: false, error: "This request was blocked." }, 403);

  const status = await adminStatus();
  if (!status.secretOk) {
    return json(
      { success: false, error: "The admin panel is not set up yet. Add ADMIN_SESSION_SECRET to the environment." },
      503,
    );
  }
  if (!status.configured) {
    return json(
      { success: false, error: "The admin panel is not set up yet. Add ADMIN_PASSWORD to the environment." },
      503,
    );
  }

  const ip = await clientIp();
  if (!(await withinRateLimit(`login:${ip}`, 8, 15 * 60))) {
    return json({ success: false, error: "Too many attempts. Please wait 15 minutes and try again." }, 429);
  }

  try {
    const body = (await req.json()) as { username?: unknown; password?: unknown; recaptcha?: unknown };
    const username = typeof body.username === "string" ? body.username : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!(await verifyRecaptcha(typeof body.recaptcha === "string" ? body.recaptcha.slice(0, 4000) : "", ip))) {
      return json({ success: false, error: "Please complete the security check (I'm not a robot) and try again." }, 400);
    }
    // Guessing one account from many different addresses is slowed down too: 10 tries per account in 15 minutes.
    const accountKey = `account:${username.trim().toLowerCase()}`;
    if (!(await withinRateLimit(accountKey, 10, 15 * 60))) {
      return json({ success: false, error: "Too many attempts for this account. Please wait 15 minutes and try again." }, 429);
    }
    const who = await verifyLogin(username, password);
    if (!who) {
      await logAudit("sign-in", `Failed sign-in to /admin as "${username.slice(0, 60)}"`, { id: "", name: "Unknown", email: username.slice(0, 120) });
      return json({ success: false, error: "The username or password is not correct." }, 401);
    }
    await createAdminSession(who);
    await logAudit("sign-in", "Signed in to /admin", { id: "root", name: "Administrator", email: who });
    await resetRateLimit(`login:${ip}`);
    await resetRateLimit(accountKey);
    return json({ success: true });
  } catch (error) {
    return failure(error, "Could not sign you in. Please try again.");
  }
}

export async function DELETE(req: Request) {
  if (!(await sameOrigin(req))) return json({ success: false, error: "This request was blocked." }, 403);
  await clearAdminSession();
  return json({ success: true });
}

/** Sent now and then by the open panel while someone is working: another 20 minutes before the idle sign-out. */
export async function PATCH(req: Request) {
  if (!(await sameOrigin(req))) return json({ success: false, error: "This request was blocked." }, 403);
  if (!(await renewAdminSession())) return json({ success: false, error: "Not signed in." }, 401);
  return json({ success: true });
}
