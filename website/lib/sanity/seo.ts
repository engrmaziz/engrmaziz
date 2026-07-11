/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { CONFIG } from '@/lib/config/constants';

/**
 * Automates JSON-LD Structured Data Generation for SEO/AEO.
 * Injects directly into Next.js Metadata and page layouts.
 */
export class SEOEngine {
  
  generateArticleSchema(post: any) {
    return {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": post.seoTitle || post.title,
      "description": post.seoDescription || post.excerpt,
      "image": post.mainImage ? [post.mainImage.url] : [],
      "datePublished": post.publishedAt,
      "dateModified": post._updatedAt || post.publishedAt,
      "author": [{
          "@type": "Person",
          "name": post.author?.name || "Musharraf Aziz",
          "url": "https://maziz.me/about"
      }],
      "publisher": {
          "@type": "Organization",
          "name": "Musharraf Aziz - Enterprise Engineering",
          "logo": {
              "@type": "ImageObject",
              "url": "https://maziz.me/logo.png"
          }
      },
      "keywords": [post.primaryKeyword, ...(post.technologies || [])].join(', ')
    };
  }

  generateFAQSchema(faqs: {question: string, answer: string}[]) {
    if (!faqs || faqs.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }
}

export const seoEngine = new SEOEngine();
