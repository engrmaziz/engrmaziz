/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
export const siteMetadata = {
  title: "Musharraf Aziz | Senior Software Architect",
  description: "Enterprise-grade portfolio for an AI/ML Backend Engineer specializing in RAG pipelines and production voice AI systems.",
  siteUrl: "https://musharrafaziz.com",
  author: "Musharraf Aziz",
  jobTitle: "Senior Software Architect",
  email: "hello@musharrafaziz.com",
  social: {
    github: "https://github.com/engrmaziz",
    linkedin: "https://linkedin.com/in/engrmaziz"
  }
};

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": siteMetadata.author,
    "jobTitle": siteMetadata.jobTitle,
    "url": siteMetadata.siteUrl,
    "sameAs": [
      siteMetadata.social.github,
      siteMetadata.social.linkedin
    ],
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "NUCES - FAST",
      "sameAs": "https://nu.edu.pk/"
    },
    "knowsAbout": ["Artificial Intelligence", "Backend Engineering", "RAG Systems", "Go", "Python", "Cloud Architecture"]
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": siteMetadata.siteUrl,
    "name": siteMetadata.title,
    "description": siteMetadata.description,
    "publisher": {
      "@type": "Organization",
      "name": siteMetadata.author,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteMetadata.siteUrl}/favicon.ico`
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteMetadata.siteUrl}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}
