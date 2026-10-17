import type { NextConfig } from "next";
import { securityHeaders } from "./lib/security/headers";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Media Library video thumbnails. The feed's own numbered hosts (i2, i3...)
  // are not used: thumbnails are rebuilt on i.ytimg.com from the video id.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
  // Security headers, static so pages stay prerendered. See lib/security.
  async headers() {
    return securityHeaders(process.env.NODE_ENV === "development");
  },
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
