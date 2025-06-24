import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdirSync, existsSync } from "fs";
import matter from "gray-matter";
import slugify from "slugify";

export const dynamic = "force-dynamic"; // This ensures dynamic route behavior

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (
      !file ||
      (file.type !== "text/markdown" && !file.name.endsWith(".mdx"))
    ) {
      return NextResponse.json(
        { error: "Please upload a valid .mdx file." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const content = buffer.toString("utf-8");

    const { data } = matter(content);
    const title = data?.title;

    if (!title) {
      return NextResponse.json(
        { error: "The uploaded file must contain a 'title' in frontmatter." },
        { status: 400 }
      );
    }

    const filename = `${slugify(title, { lower: true, strict: true })}.mdx`;
    const outputDir = path.join(process.cwd(), "src", "content", "blog");

    // Make directory if it doesn't exist
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const filepath = path.join(outputDir, filename);

    // 🚨 Check if file already exists
    if (existsSync(filepath)) {
      return NextResponse.json(
        { error: "A blog post with this title already exists." },
        { status: 409 }
      );
    }

    // Save file
    await writeFile(filepath, content, "utf8");

    return NextResponse.json({ success: true, filename });
  } catch (error: any) {
    console.error("Error uploading blog:", error);
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
