/**
 * next-sitemap configuration
 * Set SITE_URL or NEXT_PUBLIC_SITE_URL in your environment to override the default.
 */
const siteUrl =
  process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sergiuchiriac.com';

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  trailingSlash: false,
  outDir: 'public',
  exclude: [],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};

