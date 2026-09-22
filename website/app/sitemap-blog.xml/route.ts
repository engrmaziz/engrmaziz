import { getAllPosts } from "@/lib/blog";

const CANONICAL = "https://maziz.me";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET() {
  const posts = getAllPosts();
  const articleUrls = posts
    .map((post) => {
      const images = [post.coverImage, post.content.match(/\/images\/blog\/diagram-[^)\s]+/)?.[0]]
        .filter((src): src is string => Boolean(src))
        .map(
          (src) => `    <image:image>
      <image:loc>${CANONICAL}${src}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
    </image:image>`
        )
        .join("\n");
      return `  <url>
    <loc>${CANONICAL}/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${images}
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${CANONICAL}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>
${articleUrls}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
