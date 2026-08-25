/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
export const siteMetadata = {
  title: "Musharraf Aziz | Hire a Senior AI Engineer (Freelance or Full-Time)",
  description:
    "Hire Musharraf Aziz for remote freelance projects or full-time roles. Custom AI call agents, chatbots, RAG agents, and workflow automation for California and Florida companies.",
  siteUrl: "https://musharrafaziz.com",
  author: "Musharraf Aziz",
  jobTitle: "Senior AI Engineer",
  email: "io@maziz.me",
  image: "/images/maklight.webp",
  social: {
    github: "https://github.com/engrmaziz",
    linkedin: "https://www.linkedin.com/in/musharrafazizq/",
  },
  location: {
    city: "Lahore",
    region: "Punjab",
    country: "Pakistan",
    countryCode: "PK",
  },
  availability: {
    freelance: true,
    fullTime: true,
    remote: true,
    note: "Available for remote freelance builds and full-time US hiring. Pacific and Eastern overlap windows.",
  },
};

const personId = `${siteMetadata.siteUrl}/#person`;
const websiteId = `${siteMetadata.siteUrl}/#website`;
const orgId = `${siteMetadata.siteUrl}/#organization`;
const serviceId = `${siteMetadata.siteUrl}/#professionalservice`;

export function generatePersonNode() {
  return {
    "@type": "Person",
    "@id": personId,
    name: siteMetadata.author,
    jobTitle: siteMetadata.jobTitle,
    url: siteMetadata.siteUrl,
    image: `${siteMetadata.siteUrl}${siteMetadata.image}`,
    email: siteMetadata.email,
    description: siteMetadata.description,
    sameAs: [siteMetadata.social.github, siteMetadata.social.linkedin],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "COMSATS University Islamabad",
      sameAs: "https://www.comsats.edu.pk/",
    },
    worksFor: {
      "@type": "Organization",
      name: "Cygnus Technologies",
    },
    homeLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: siteMetadata.location.city,
        addressRegion: siteMetadata.location.region,
        addressCountry: siteMetadata.location.countryCode,
      },
    },
    knowsLanguage: ["en", "ur"],
    knowsAbout: [
      "Custom AI Call Agents",
      "Custom AI Chatbots",
      "RAG Agents",
      "Workflow Automation",
      "AI Voice Agents",
      "LLM Orchestration",
      "Applied AI",
      "Python",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Senior AI Engineer",
      occupationLocation: {
        "@type": "AdministrativeArea",
        name: "United States",
      },
      skills: "RAG, LLM agents, voice AI, Python, Next.js",
    },
    areaServed: [
      { "@type": "State", name: "California" },
      { "@type": "State", name: "Florida" },
      { "@type": "Country", name: "United States" },
    ],
    makesOffer: [
      {
        "@type": "Offer",
        name: "Freelance AI engineering",
        availability: "https://schema.org/InStock",
        url: `${siteMetadata.siteUrl}/hire`,
        description:
          "Remote freelance and contract builds: custom AI call agents, chatbots, RAG agents, and workflow automation.",
        areaServed: [
          { "@type": "State", name: "California" },
          { "@type": "State", name: "Florida" },
        ],
      },
      {
        "@type": "Offer",
        name: "Full-time senior AI engineer",
        availability: "https://schema.org/InStock",
        url: `${siteMetadata.siteUrl}/hire`,
        description:
          "Open to full-time remote (and select hybrid/relocation) senior AI engineer roles serving US teams.",
      },
    ],
  };
}

export function generateSiteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteMetadata.siteUrl,
        name: siteMetadata.author,
        description: siteMetadata.description,
        inLanguage: "en-US",
        publisher: { "@id": orgId },
        author: { "@id": personId },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteMetadata.siteUrl}/blog?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": orgId,
        name: siteMetadata.author,
        url: siteMetadata.siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteMetadata.siteUrl}${siteMetadata.image}`,
        },
        founder: { "@id": personId },
        sameAs: [siteMetadata.social.github, siteMetadata.social.linkedin],
        email: siteMetadata.email,
        areaServed: [
          { "@type": "State", name: "California" },
          { "@type": "State", name: "Florida" },
          { "@type": "Country", name: "United States" },
        ],
      },
      generatePersonNode(),
      {
        "@type": "ProfessionalService",
        "@id": serviceId,
        name: "Musharraf Aziz — Custom AI Agents",
        url: `${siteMetadata.siteUrl}/services`,
        image: `${siteMetadata.siteUrl}${siteMetadata.image}`,
        provider: { "@id": personId },
        email: siteMetadata.email,
        areaServed: [
          { "@type": "State", name: "California" },
          { "@type": "State", name: "Florida" },
          { "@type": "Country", name: "United States" },
        ],
        availableChannel: {
          "@type": "ServiceChannel",
          serviceType: "https://schema.org/OnlineOnly",
          serviceUrl: `${siteMetadata.siteUrl}/contact`,
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "AI engineering services",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom AI Call Agents" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom AI Chatbots" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "RAG Agents" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Workflow Automation" } },
          ],
        },
      },
    ],
  };
}

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    ...generatePersonNode(),
  };
}

export function generateWebSiteSchema() {
  return generateSiteGraph();
}

export const INDEXNOW_KEY = "7f3c9a1e4b8d26c05e91a4f7b2d8c063";
