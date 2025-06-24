// app/api/blog/route.ts
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdirSync, existsSync } from "fs";
import matter from "gray-matter";
import slugify from "slugify";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("No file found in FormData");
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (file.type !== "text/markdown" && !file.name.endsWith(".mdx")) {
      console.error("Invalid file type:", file.type);
      return NextResponse.json(
        { error: "Invalid file type." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const content = buffer.toString("utf8");

    const { data } = matter(content);
    const title = data?.title;

    if (!title) {
      console.error("Missing title in frontmatter");
      return NextResponse.json(
        { error: "Missing title in frontmatter." },
        { status: 400 }
      );
    }

    const filename = `${slugify(title, { lower: true, strict: true })}.mdx`;
    const blogDir = path.join(process.cwd(), "src", "content", "blog");

    if (!existsSync(blogDir)) {
      mkdirSync(blogDir, { recursive: true });
    }

    const filePath = path.join(blogDir, filename);
    await writeFile(filePath, content, "utf8");

    console.log(`✅ Blog uploaded to: ${filePath}`);

    return NextResponse.json({ success: true, filename });
  } catch (err: any) {
    console.error("❌ Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
