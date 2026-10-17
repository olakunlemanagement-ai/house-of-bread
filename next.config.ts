import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Classes and training became House of Bread Academy. 308, so old links
  // and search results move to the new address for good.
  async redirects() {
    return [
      { source: "/classes", destination: "/academy", permanent: true },
      { source: "/classes/:slug", destination: "/academy/:slug", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
