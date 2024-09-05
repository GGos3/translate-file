import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import { promisify } from "util";
import { log } from "console";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        const uniqueId = uuidv4(); // 고유 아이디 생성
        const uploadPath = path.join(
          process.cwd(),
          "public",
          "uploads",
          uniqueId
        );

        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true }); // 디렉토리 생성
        }

        log(`Directory created at: ${uploadPath}`);
        cb(null, uploadPath);
      } catch (err) {
        console.error("Error creating directory:", err);
        cb(err, null); // Pass error to multer
      }
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname
      );
    },
  }),
});

const runMiddleware = promisify(upload.array("files"));

export async function POST(request: NextRequest) {
  try {
    // multer 미들웨어 실행
    await runMiddleware(request, request.body);

    // 업로드된 파일의 경로를 추출
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Please upload a file" },
        { status: 400 }
      );
    }

    const uploadedFiles: string[] = [];
    const uniqueId = uuidv4(); // 고유 아이디 생성

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = file.name + "-" + uniqueSuffix + path.extname(file.name); // 확장자 포함
      const filePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        uniqueId,
        filename
      );

      // Ensure directory exists before writing the file
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Write the file
      await promisify(fs.writeFile)(filePath, buffer);
      uploadedFiles.push(`/uploads/${uniqueId}/${file.name}`); // 경로에서 `/uploads/` 제거
    }

    log(uploadedFiles);

    return NextResponse.json(
      {
        uniqueId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "File upload failed", details: error.message },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
