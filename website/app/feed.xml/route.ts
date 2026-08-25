import { getAllPosts } from "@/lib/blog";
import { siteMetadata } from "@/lib/seo";

export async function GET() {
  const posts = getAllPosts();
  const baseUrl = siteMetadata.siteUrl;
  const cover = `${baseUrl}${siteMetadata.image}`;
  
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
  <title>${siteMetadata.author} — AI engineering notes</title>
  <link>${baseUrl}/blog</link>
  <description>${siteMetadata.description}</description>
  <language>en-us</language>
  <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
  ${posts.map(post => `
  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${baseUrl}/blog/${post.slug}</link>
    <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <dc:creator>${siteMetadata.author}</dc:creator>
    <description><![CDATA[${post.description}]]></description>
    <media:content url="${post.coverImage ? `${baseUrl}${post.coverImage}` : cover}" medium="image" type="image/webp" width="1200" height="630" />
    <category>${post.category}</category>
  </item>
  `).join('')}
</channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
