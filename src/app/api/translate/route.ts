import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { get } from "http";
import { getchunkedDocsFromUnstructed } from "@/lib/unstructured-loader";

export async function POST(request: NextRequest) {
  try {
    const { uniqueId, wordlist, language } = await request.json();

    if (!uniqueId || !language) {
      return NextResponse.json(
        { error: "Missing uniqueId or language" },
        { status: 400 }
      );
    }

    const uploadPath = path.join(process.cwd(), "public", "uploads", uniqueId);
    const files = fs.readdirSync(uploadPath);

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files found for the provided uniqueId" },
        { status: 404 }
      );
    }

    console.log(uniqueId, wordlist, language);

    await getchunkedDocsFromUnstructed(uniqueId);

    // 번역 처리 (파일 이름은 첫 번째 파일로 가정)
    // const translatedFiles = await Promise.all(files.map(async (file) => {
    //   const filePath = path.join(uploadPath, file);
    //   const translatedFileUrl = await translateFile(filePath, language); // 번역 함수
    //   return translatedFileUrl;
    // }));

    return NextResponse.json({ fileUrls: ["fff.md"] }, { status: 200 });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Translation failed", details: error.message },
      { status: 500 }
    );
  }
}
