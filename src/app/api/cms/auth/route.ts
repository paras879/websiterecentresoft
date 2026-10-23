import { adminStatus, clientIp, resetRateLimit, sameOrigin, withinRateLimit } from "@/lib/admin-auth";
import { cmsLogin, cmsLogout, getCmsUser } from "@/lib/cms-auth";
import { logAudit } from "@/lib/audit";
import { failure, json } from "@/lib/api";
import { verifyRecaptcha } from "@/lib/recaptcha";

export async function GET() {
  const user = await getCmsUser();
  if (!user) return json({ success: false, error: "Not signed in." }, 401);
  return json({
    success: true,
    user: { id: user.id, email: user.email, name: user.name, roleId: user.roleId, roleName: user.role.name, root: user.root },
    permissions: user.permissions,
  });
}

export async function POST(req: Request) {
  if (!(await sameOrigin(req))) return json({ success: false, error: "This request was blocked." }, 403);

  const status = await adminStatus();
  if (!status.secretOk) {
    return json({ success: false, error: "The panel is not set up yet. Add ADMIN_SESSION_SECRET to the environment." }, 503);
  }

  const ip = await clientIp();
  if (!(await withinRateLimit(`cmslogin:${ip}`, 8, 15 * 60))) {
    return json({ success: false, error: "Too many attempts. Please wait 15 minutes and try again." }, 429);
  }

  try {
    const body = (await req.json()) as { email?: unknown; password?: unknown; recaptcha?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
    const password = typeof body.password === "string" ? body.password.slice(0, 200) : "";
    if (!email || !password) return json({ success: false, error: "Enter your email and password." }, 400);

    if (!(await verifyRecaptcha(typeof body.recaptcha === "string" ? body.recaptcha.slice(0, 4000) : "", ip))) {
      return json({ success: false, error: "Please complete the security check (I'm not a robot) and try again." }, 400);
    }
    // Guessing one account from many different addresses is slowed down too: 10 tries per account in 15 minutes.
    const accountKey = `cmsaccount:${email.toLowerCase()}`;
    if (!(await withinRateLimit(accountKey, 10, 15 * 60))) {
      return json({ success: false, error: "Too many attempts for this account. Please wait 15 minutes and try again." }, 429);
    }
    const result = await cmsLogin(email, password);
    if (!result.ok) {
      await logAudit("sign-in", `${result.reason === "disabled" ? "Blocked sign-in (account switched off)" : "Failed sign-in"} as "${email.slice(0, 60)}"`, { id: "", name: "Unknown", email });
      return json(
        {
          success: false,
          error:
            result.reason === "disabled"
              ? "This account is switched off. Ask an administrator."
              : "The email or password is not correct.",
        },
        401,
      );
    }
    await logAudit("sign-in", "Signed in to /admin1", result.user);
    await resetRateLimit(`cmslogin:${ip}`);
    await resetRateLimit(accountKey);
    return json({ success: true });
  } catch (error) {
    return failure(error, "Could not sign you in. Please try again.");
  }
}

export async function DELETE(req: Request) {
  if (!(await sameOrigin(req))) return json({ success: false, error: "This request was blocked." }, 403);
  await cmsLogout();
  return json({ success: true });
}
