import { clearAdminSession, saveCredentials, verifyCurrentPassword } from "@/lib/admin-auth";
import { failure, guardAdmin, json } from "@/lib/api";

export async function POST(req: Request) {
  const denied = await guardAdmin(req, { write: true });
  if (denied) return denied;

  try {
    const body = (await req.json()) as { current?: unknown; username?: unknown; next?: unknown };
    const current = typeof body.current === "string" ? body.current : "";
    const next = typeof body.next === "string" ? body.next : "";
    const username = typeof body.username === "string" ? body.username.trim() : "";

    if (!(await verifyCurrentPassword(current))) {
      return json({ success: false, error: "Your current password is not correct." }, 400);
    }
    if (next.length < 10) {
      return json({ success: false, error: "Use at least 10 characters for the new password." }, 400);
    }
    if (!username || username.length > 40) {
      return json({ success: false, error: "Enter a username up to 40 characters." }, 400);
    }

    await saveCredentials(username, next);
    // Every session, including this one, is now invalid. The person signs in again with the new password.
    await clearAdminSession();
    return json({ success: true });
  } catch (error) {
    return failure(error, "Could not change the password.");
  }
}
