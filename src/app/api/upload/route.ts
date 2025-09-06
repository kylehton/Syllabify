import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export const POST = async (req: NextRequest) => {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/pdf")) {
      return NextResponse.json({ error: "Only PDF files allowed" }, { status: 400 });
    }

    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdfParse(buffer);
    return NextResponse.json({ text: data.text, numPages: data.numpages });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "PDF parse failed" }, { status: 500 });
  }
};
