import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content/blog");

export function getAllPosts() {
  const filenames = fs.readdirSync(postsDirectory);

  return filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    return {
      ...data,
      slug: data.slug || filename.replace(/\.mdx?$/, ""),
    };
  });
}
