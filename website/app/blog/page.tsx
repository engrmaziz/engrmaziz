import { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogClient } from "@/components/blog/BlogClient";

export const metadata: Metadata = {
  title: "Engineering Knowledge Center & Blog",
  description: "Technical publications covering system architecture, Go backend engineering, AI automation, and scalable deployments.",
  openGraph: {
    title: "Engineering Knowledge Center",
    description: "Deep dive technical articles and architecture patterns.",
    type: "website",
  }
};

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogClient initialPosts={posts} />;
}
