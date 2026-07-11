import { MetadataRoute } from 'next';
import { getAllProjects } from '@/lib/projects';
import { getAllServices } from '@/lib/services';
import { getAllPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://musharrafaziz.com'; // Should ideally be ENV var

  // Base routes
  const routes = [
    '',
    '/about',
    '/projects',
    '/services',
    '/blog',
    '/contact',
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

  return [...routes, ...projects, ...services, ...posts];
}
