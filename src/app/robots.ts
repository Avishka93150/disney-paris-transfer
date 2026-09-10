import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The back office and the server routes have no business in an index.
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
