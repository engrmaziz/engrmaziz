import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://musharrafaziz.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/private/', '/drafts/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
