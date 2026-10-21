import type { NextResponse } from "next/server";
import { sameOrigin } from "./admin-auth";
import type { Action } from "./cms-access";
import { allowed, getCmsUser, type CmsUser } from "./cms-auth";
import { CmsError } from "./cms-users";
import { failure, json } from "./api";

/** Signed-in person with the right to do `action` on `resource`, or the response to send back instead. */
export async function guardCms(
  req: Request,
  need: { resource: string; action: Action } | null,
  opts: { write?: boolean } = {},
): Promise<{ user: CmsUser } | { denied: NextResponse }> {
  if (opts.write && !(await sameOrigin(req))) {
    return { denied: json({ success: false, error: "This request was blocked for your safety." }, 403) };
  }
  const user = await getCmsUser();
  if (!user) return { denied: json({ success: false, error: "Please sign in again." }, 401) };
  if (need && !allowed(user, need.resource, need.action)) {
    return { denied: json({ success: false, error: "Your role does not allow this." }, 403) };
  }
  return { user };
}

/** Turns an expected problem (bad input, missing user) into a clear reply, and anything else into a generic one. */
export function cmsFailure(error: unknown, fallback: string): NextResponse {
  if (error instanceof CmsError) return json({ success: false, error: error.message }, error.status);
  return failure(error, fallback);
}
