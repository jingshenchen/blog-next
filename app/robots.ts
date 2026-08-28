import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// static export 下 metadata route 必须显式固化
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
