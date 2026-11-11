import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import VenueCard from "@/components/VenueCard";
import { formatDate, getPost, getPosts } from "@/lib/blog";
import { getVenues } from "@/lib/venues";
import { site } from "@/site.config";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: { type: "article", title: post.title, description: post.summary, publishedTime: post.date },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const mentioned = getVenues().filter((v) => post.venues.includes(v.handle));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary || undefined,
    datePublished: post.date,
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <article className="post">
      <Link href="/blog/" className="back">
        ← All articles
      </Link>
      <span className="post-emoji" aria-hidden="true">
        {post.emoji}
      </span>
      <h1>{post.title}</h1>
      <p className="post-date">{formatDate(post.date)}</p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

      {mentioned.length ? (
        <section className="mentioned">
          <h2>Places in this article</h2>
          <ul className="vlist">
            {mentioned.map((v) => (
              <li key={v.slug}>
                <VenueCard venue={v} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
