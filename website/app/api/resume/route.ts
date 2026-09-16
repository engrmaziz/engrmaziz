import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const FILE_NAME = "Musharraf_Aziz_CV.pdf";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", FILE_NAME);
    const buf = await readFile(filePath);

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${FILE_NAME}"`,
        "Content-Length": String(buf.byteLength),
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("[Resume API]", error);
    return NextResponse.json({ error: "Resume is unavailable." }, { status: 404 });
  }
}
