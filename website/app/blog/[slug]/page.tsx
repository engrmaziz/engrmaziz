import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { BlogDetailLayout } from "@/components/blog/BlogDetailLayout";
import { siteMetadata } from "@/lib/seo";

// Ensure this page is statically generated at build time
export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  const cleanDescription = post.description || `Technical article: ${post.title}`;
  const image = post.coverImage ? `${siteMetadata.siteUrl}${post.coverImage}` : undefined;
  
  return {
    title: `${post.title} | Knowledge Center`,
    description: cleanDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: cleanDescription,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags || [],
      url: `${siteMetadata.siteUrl}/blog/${post.slug}`,
      images: image ? [{ url: image, width: 1200, height: 675, alt: post.coverAlt || post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: cleanDescription,
      images: image ? [image] : undefined,
    }
  };
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Article JSON-LD Schema
  const pageUrl = `${siteMetadata.siteUrl}/blog/${post.slug}`;
  const image = post.coverImage ? `${siteMetadata.siteUrl}${post.coverImage}` : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        image,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: "en-US",
        keywords: (post.tags || []).join(", "),
        articleSection: post.category,
        mainEntityOfPage: pageUrl,
        url: pageUrl,
        author: {
          "@type": "Person",
          name: post.author || "Engr. Musharraf Aziz",
          honorificPrefix: "Engr.",
          url: `${siteMetadata.siteUrl}/about`,
        },
        publisher: {
          "@type": "Person",
          name: "Engr. Musharraf Aziz",
          url: siteMetadata.siteUrl,
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-speakable]"],
        },
        about: [
          { "@type": "State", name: "California" },
          { "@type": "State", name: "Florida" },
        ],
      },
      ...(post.faqs && post.faqs.length
        ? [{
            "@type": "FAQPage",
            mainEntity: post.faqs.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailLayout post={post} />
    </>
  );
}
