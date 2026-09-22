import { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogClient } from "@/components/blog/BlogClient";

export const metadata: Metadata = {
  title: "Engineering Knowledge Center & Blog",
  description: "Technical articles on decision models, computer-use agents, frontier pacing, open-weight distillation, coding harnesses, robotics, data-center power, and agent security.",
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
