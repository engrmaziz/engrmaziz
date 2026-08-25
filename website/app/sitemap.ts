import { MetadataRoute } from 'next';
import { getAllProjects } from '@/lib/projects';
import { getAllServices } from '@/lib/services';
import { getAllPosts } from '@/lib/blog';
import { getAllGeoPaths } from '@/lib/geo';
import { siteMetadata } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteMetadata.siteUrl;

  // Base routes
  const routes = [
    '',
    '/about',
    '/hire',
    '/entity',
    '/projects',
    '/services',
    '/blog',
    '/contact',
    '/sitemap',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Projects
  const projects = getAllProjects().map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.updated || new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Services
  const services = getAllServices().map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: service.updated || new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Blog Posts
  const posts = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date || new Date().toISOString(),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  const geo = getAllGeoPaths().map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: path.split('/').length === 3 ? 0.9 : 0.85,
  }));

  return [...routes, ...projects, ...services, ...geo, ...posts];
}
