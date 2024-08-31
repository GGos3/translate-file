import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import { promisify } from "util";

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  }),
});

const runMiddleware = promisify(upload.array("files"));

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Please upload a file" },
        { status: 400 }
      );
    }

    const uploadedFiles: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = file.name + "-" + uniqueSuffix;
      const filePath = path.join(process.cwd(), "public", "uploads", filename);

      await promisify(require("fs").writeFile)(filePath, buffer);
      uploadedFiles.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ fileUrls: uploadedFiles }, { status: 200 });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
