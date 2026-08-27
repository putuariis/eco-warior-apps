import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { getCurrentSession } from "@/lib/session";

export async function POST(req: Request) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url } = await req.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Missing photo URL." }, { status: 400 });
  }

  await db.update(user).set({ image: url, updatedAt: new Date() }).where(eq(user.id, session.user.id));

  return NextResponse.json({ ok: true, url });
}
