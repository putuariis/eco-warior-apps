import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { actions } from "@/lib/db/schema";
import { calculateImpact } from "@/lib/impact";
import { getCurrentSession } from "@/lib/session";
import { isYoutubeUrl, normalizeYoutubeUrl } from "@/lib/video";

export async function POST(req: Request) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const category = String(body.category || "Other");
  const quantity = Number(body.quantity || 0);
  const unit = String(body.unit || "kg");
  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const location = body.location ? String(body.location).trim() : null;
  const photoUrl = body.photoUrl ? String(body.photoUrl) : null;
  const videoUrl = body.videoUrl ? String(body.videoUrl) : null;
  const youtubeUrlRaw = body.youtubeUrl ? String(body.youtubeUrl).trim() : "";

  if (!title || !Number.isFinite(quantity) || quantity <= 0 || description.length < 5) {
    return NextResponse.json({ error: "Activity name, quantity and a description are required." }, { status: 400 });
  }

  let youtubeUrl: string | null = null;
  if (youtubeUrlRaw) {
    if (!isYoutubeUrl(youtubeUrlRaw)) {
      return NextResponse.json({ error: "That doesn't look like a valid YouTube link." }, { status: 400 });
    }
    youtubeUrl = normalizeYoutubeUrl(youtubeUrlRaw);
  }

  // Video evidence is mandatory: either an uploaded video file or a YouTube link.
  if (!videoUrl && !youtubeUrl) {
    return NextResponse.json(
      { error: "Video evidence is required — upload a short video or paste a YouTube link." },
      { status: 400 },
    );
  }

  const impact = calculateImpact({ category, quantity, unit });

  const [action] = await db
    .insert(actions)
    .values({
      userId: session.user.id,
      category,
      title,
      description,
      quantity,
      unit,
      co2Reduced: impact.co2Reduced,
      wasteDiverted: impact.wasteDiverted,
      xpReward: impact.xp,
      tokenReward: impact.estimatedTokens,
      status: "PENDING",
      photoUrl,
      videoUrl,
      youtubeUrl,
      location,
    })
    .returning();

  return NextResponse.json({ ok: true, id: action.id, impact, status: action.status });
}
