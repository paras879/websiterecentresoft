import { NextResponse } from "next/server";
import { isAuthenticatedAdmin, sameOrigin } from "./admin-auth";
import type { Action } from "./cms-access";
import { allowed, getCmsUser } from "./cms-auth";
import { StoreUnavailableError } from "./store";

export function json(body: Record<string, unknown>, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Maps a thrown error to a response the admin panel can show to a person. */
export function failure(error: unknown, fallback = "Something went wrong. Please try again."): NextResponse {
  if (error instanceof StoreUnavailableError) {
    return json({ success: false, code: "storage_unavailable", error: error.message }, 503);
  }
  console.error(error);
  return json({ success: false, error: fallback }, 500);
}

/**
 * Guards an admin route. Returns a response to send back when the request must be refused,
 * or null when it may continue. Routes that change data also reject requests from other sites.
 */
export async function guardAdmin(
  req: Request,
  opts: { write?: boolean; perm?: [resource: string, action: Action] } = {},
): Promise<NextResponse | null> {
  if (opts.write && !(await sameOrigin(req))) {
    return json({ success: false, error: "This request was blocked for your safety." }, 403);
  }
  if (await isAuthenticatedAdmin()) return null;

  // A person from the /admin1 panel may use the route when their role allows this action.
  if (opts.perm) {
    const user = await getCmsUser();
    if (user) {
      return allowed(user, opts.perm[0], opts.perm[1])
        ? null
        : json({ success: false, error: "Your role does not allow this." }, 403);
    }
  }
  return json({ success: false, error: "Please sign in again." }, 401);
}
