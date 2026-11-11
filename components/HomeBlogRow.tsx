"use client";

import Link from "next/link";
import PostCard from "@/components/PostCard";
import { useLang } from "@/lib/lang";

type PostSlim = { slug: string; title: string; date: string; summary: string; emoji: string };

export default function HomeBlogRow({ posts }: { posts: PostSlim[] }) {
  const { t } = useLang();
  if (!posts.length) return null;
  return (
    <section className="home-blog">
      <div className="row-head">
        <h2>{t.freshFromBlog}</h2>
        <Link href="/blog/">{t.allArticlesShort}</Link>
      </div>
      <ul className="plist">
        {posts.map((p) => (
          <li key={p.slug}>
            <PostCard post={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
