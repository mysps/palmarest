import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides, round-ups and stories about eating and drinking in Palma and around Mallorca.",
};

export default function BlogPage() {
  const posts = getPosts();
  return (
    <>
      <section className="hero hero-small">
        <h1>Blog</h1>
        <p className="lede">Guides, round-ups and stories about eating and drinking around the island.</p>
      </section>
      {posts.length ? (
        <ul className="plist">
          {posts.map((p) => (
            <li key={p.slug}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">
          <p>No articles yet. The first one is on its way.</p>
        </div>
      )}
    </>
  );
}
