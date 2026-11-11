import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type Post = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  emoji: string;
  /** Instagram handles of venues mentioned, shown as cards under the article. */
  venues: string[];
  html: string;
};

const DIR = path.join(process.cwd(), "content", "blog");

/** Every .md file in content/blog is an article. Files with `draft: true` are skipped. */
export function getPosts(): Post[] {
  const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith(".md")) : [];
  return files
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
      if (data.draft) return null;
      const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? "");
      return {
        slug: file.replace(/\.md$/, ""),
        title: String(data.title ?? file),
        date,
        summary: String(data.summary ?? ""),
        emoji: String(data.emoji ?? "✍️"),
        venues: Array.isArray(data.venues) ? data.venues.map(String) : [],
        html: marked.parse(content, { async: false }) as string,
      };
    })
    .filter((p): p is Post => p !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug);

export { formatDate } from "@/lib/date";
