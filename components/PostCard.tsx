import Link from "next/link";
import type { Post } from "@/lib/blog";
import { formatDate } from "@/lib/date";
import { colourFor } from "@/lib/look";

export default function PostCard({ post }: { post: Pick<Post, "slug" | "title" | "date" | "summary" | "emoji"> }) {
  return (
    <Link href={`/blog/${post.slug}/`} className={`pcard bg-${colourFor(post.slug)}`}>
      <span className="pcard-emoji" aria-hidden="true">
        {post.emoji}
      </span>
      <span className="pcard-title">{post.title}</span>
      {post.summary ? <span className="pcard-summary">{post.summary}</span> : null}
      <span className="pcard-date">{formatDate(post.date)}</span>
    </Link>
  );
}
