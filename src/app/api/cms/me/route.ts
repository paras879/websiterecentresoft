import { cmsFailure, guardCms } from "@/lib/cms-guard";
import { json } from "@/lib/api";

/**
 * People cannot change their own name, email, username or password. Only an administrator can, from the Users screen,
 * so a signed-in account cannot be handed over or locked out by whoever is sitting at it.
 */
export async function PATCH(req: Request) {
  const guard = await guardCms(req, null, { write: true });
  if ("denied" in guard) return guard.denied;
  try {
    return json({ success: false, error: "Your account details are locked. Please contact your administrator to change them." }, 403);
  } catch (error) {
    return cmsFailure(error, "Could not save your details.");
  }
}
