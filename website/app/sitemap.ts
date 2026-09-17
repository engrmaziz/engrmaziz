import { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects";
import { getAllServices } from "@/lib/services";
import { getAllPosts } from "@/lib/blog";
import { getAllGeoPaths } from "@/lib/geo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CANONICAL = "https://maziz.me";

function entry(
  path: string,
  options: {
    lastModified?: string | Date;
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority?: number;
  } = {}
): MetadataRoute.Sitemap[number] {
  return {
    url: `${CANONICAL}${path}`,
    lastModified: options.lastModified ?? new Date(),
    changeFrequency: options.changeFrequency ?? "weekly",
    priority: options.priority ?? 0.7,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const core: MetadataRoute.Sitemap = [
    entry("", { changeFrequency: "weekly", priority: 1 }),
    entry("/hire", { changeFrequency: "weekly", priority: 0.95 }),
    entry("/services", { changeFrequency: "weekly", priority: 0.9 }),
    entry("/about", { changeFrequency: "monthly", priority: 0.85 }),
    entry("/projects", { changeFrequency: "weekly", priority: 0.8 }),
    entry("/blog", { changeFrequency: "weekly", priority: 0.75 }),
    entry("/contact", { changeFrequency: "monthly", priority: 0.8 }),
    entry("/entity", { changeFrequency: "monthly", priority: 0.7 }),
    entry("/sitemap", { changeFrequency: "weekly", priority: 0.4 }),
    entry("/privacy", { changeFrequency: "yearly", priority: 0.2 }),
    entry("/terms", { changeFrequency: "yearly", priority: 0.2 }),
  ];

  const projects = getAllProjects().map((project) =>
    entry(`/projects/${project.slug}`, {
      lastModified: project.updated || project.created || new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  const services = getAllServices().map((service) =>
    entry(`/services/${service.slug}`, {
      lastModified: service.updated || new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    })
  );

  const posts = getAllPosts().map((post) =>
    entry(`/blog/${post.slug}`, {
      lastModified: post.date || new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    })
  );

  const geo = getAllGeoPaths().map((path) =>
    entry(path, {
      changeFrequency: "weekly",
      priority: path.split("/").filter(Boolean).length === 2 ? 0.9 : 0.85,
    })
  );

  return [...core, ...projects, ...services, ...geo, ...posts];
}
