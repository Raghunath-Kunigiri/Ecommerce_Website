import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

const bodySchema = z
  .object({
    folder: z.string().min(1).optional(),
  })
  .optional();

export async function POST(req: Request) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary env is not configured" },
      { status: 500 },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  const folder = parsed.success ? parsed.data?.folder : undefined;

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign: Record<string, string | number> = { timestamp };
  if (folder) paramsToSign.folder = folder;

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return NextResponse.json({
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder: folder ?? "",
  });
}

