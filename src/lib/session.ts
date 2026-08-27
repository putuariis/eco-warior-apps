import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/** Resolve the current Better Auth session on the server. */
export async function getCurrentSession() {
  return auth.api.getSession({ headers: await headers() });
}

/**
 * Resolve just the current user id. Every route handler or server query that
 * reads or writes user-owned data MUST go through this — there is no Row
 * Level Security on Neon, so this is what stops user A from touching user
 * B's rows.
 */
export async function requireUserId() {
  const session = await getCurrentSession();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user.id;
}
