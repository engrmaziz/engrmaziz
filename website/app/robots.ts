import { MetadataRoute } from "next";
import { siteMetadata } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteMetadata.siteUrl;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/", "/drafts/", "/admin", "/admin/"],
      },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Googlebot-Image", allow: "/" },
      { userAgent: "Googlebot-Mobile", allow: "/" },
      { userAgent: "GoogleOther", allow: "/" },
      { userAgent: "Google-CloudVertexBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "meta-externalagent", allow: "/" },
      { userAgent: "FacebookBot", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "YouBot", allow: "/" },
      { userAgent: "DuckAssistBot", allow: "/" },
      { userAgent: "Bytespider", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "PetalBot", disallow: "/" },
      { userAgent: "ImagesiftBot", disallow: "/" },
      { userAgent: "Diffbot", disallow: "/" },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/sitemap-index.xml`],
    host: baseUrl,
  };
}
