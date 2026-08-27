import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const tags = getAllTags();
  const latest = posts[0]?.date ?? new Date().toISOString().slice(0, 10);

  return [
    { url: siteConfig.url, lastModified: latest, priority: 1 },
    { url: `${siteConfig.url}/blog`, lastModified: latest, priority: 0.8 },
    { url: `${siteConfig.url}/tags`, lastModified: latest, priority: 0.5 },
    { url: `${siteConfig.url}/about`, priority: 0.3 },
    ...posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: post.date,
      priority: 0.7,
    })),
    ...tags.map(({ tag }) => ({
      url: `${siteConfig.url}/tags/${encodeURIComponent(tag)}`,
      lastModified: latest,
      priority: 0.4,
    })),
  ];
}
