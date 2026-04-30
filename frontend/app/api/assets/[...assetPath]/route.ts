import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const MIME_TYPES: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".json": "application/json",
  ".md": "text/markdown; charset=utf-8",
};

function isAllowedAsset(assetPath: string) {
  return assetPath.startsWith("fixtures/") || assetPath.startsWith("docs/assets/");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assetPath: string[] }> }
) {
  const { assetPath } = await params;
  const relative = assetPath.join("/");

  if (!isAllowedAsset(relative)) {
    return NextResponse.json({ detail: "Asset not allowed." }, { status: 403 });
  }

  const repoRoot = path.resolve(process.cwd(), "..");
  const absolute = path.resolve(repoRoot, relative);
  if (!absolute.startsWith(repoRoot)) {
    return NextResponse.json({ detail: "Asset path rejected." }, { status: 403 });
  }

  try {
    const buffer = await fs.readFile(absolute);
    const ext = path.extname(absolute).toLowerCase();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch {
    return NextResponse.json({ detail: "Asset not found." }, { status: 404 });
  }
}
