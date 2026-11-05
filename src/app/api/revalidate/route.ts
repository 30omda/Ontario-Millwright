import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/** Sanity webhook → revalidate cached content (configure in sanity.io/manage with SANITY_REVALIDATE_SECRET). */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ message: "Revalidation not configured" }, { status: 501 });
  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret);
  if (!isValidSignature) return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  const tag = body?._type === "siteSettings" ? "settings" : "home";
  revalidateTag(tag, "max");
  return NextResponse.json({ revalidated: tag });
}
