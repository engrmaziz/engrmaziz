import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { getAllServices } from "@/lib/services";
import { getAllProjects } from "@/lib/projects";
import { getAllPosts } from "@/lib/blog";
import { CITIES, GEO_SERVICES, MARKETS } from "@/lib/geo";
import { siteMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "HTML Sitemap",
  description: "Every public page on Musharraf Aziz’s site — services, California and Florida locations, projects, and hire.",
  alternates: { canonical: "/sitemap" },
  robots: { index: true, follow: true },
};

export default function HtmlSitemapPage() {
  const services = getAllServices();
  const projects = getAllProjects();
  const posts = getAllPosts();

  return (
    <Section className="pt-32 pb-24 bg-base">
      <Container>
        <h1 className="text-4xl font-bold text-primary mb-4">Sitemap</h1>
        <p className="text-secondary mb-4 max-w-2xl">
          Human-readable map of the site. Machine sitemap:{" "}
          <Link href="/sitemap.xml" className="text-accent font-medium hover:underline">
            /sitemap.xml
          </Link>
          . AI index:{" "}
          <Link href="/llms.txt" className="text-accent font-medium hover:underline">
            /llms.txt
          </Link>
          .
        </p>

        <h2 className="text-2xl font-bold text-primary mt-12 mb-4">Core</h2>
        <ul className="grid sm:grid-cols-2 gap-2 text-secondary">
          {([
            ["/", "Home"],
            ["/hire", "Hire (freelance or full-time)"],
            ["/entity", "Entity facts (for AI assistants)"],
            ["/about", "About"],
            ["/services", "Services"],
            ["/projects", "Projects"],
            ["/blog", "Blog"],
            ["/contact", "Contact"],
          ] as const).map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="hover:text-accent">
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold text-primary mt-12 mb-4">National services</h2>
        <ul className="grid sm:grid-cols-2 gap-2 text-secondary">
          {services.map((service) => (
            <li key={service.slug}>
              <Link href={`/services/${service.slug}`} className="hover:text-accent">
                {service.title}
              </Link>
            </li>
          ))}
        </ul>

        {(["california", "florida"] as const).map((state) => (
          <div key={state}>
            <h2 className="text-2xl font-bold text-primary mt-12 mb-4">{MARKETS[state].name}</h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-secondary">
              <li>
                <Link href={`/services/${state}`} className="hover:text-accent font-medium">
                  {MARKETS[state].name} hub
                </Link>
              </li>
              {GEO_SERVICES.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${state}/${service.slug}`} className="hover:text-accent">
                    {service[state].h1}
                  </Link>
                </li>
              ))}
              {CITIES.filter((city) => city.state === state).map((city) => (
                <li key={city.slug}>
                  <Link href={`/services/${state}/${city.slug}`} className="hover:text-accent">
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <h2 className="text-2xl font-bold text-primary mt-12 mb-4">Projects</h2>
        <ul className="grid sm:grid-cols-2 gap-2 text-secondary">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link href={`/projects/${project.slug}`} className="hover:text-accent">
                {project.title}
              </Link>
            </li>
          ))}
        </ul>

        {posts.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-primary mt-12 mb-4">Blog</h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-secondary">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="hover:text-accent">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="text-sm text-secondary mt-16">
          Canonical host: {siteMetadata.siteUrl}
        </p>
      </Container>
    </Section>
  );
}
