/** @type {import('next').NextConfig} */
module.exports = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  },
  compiler: { removeConsole: process.env.NODE_ENV === "production" },
  async headers() {
    const sec = [
      { key: "X-DNS-Prefetch-Control",    value: "on" },
      { key: "X-Frame-Options",           value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options",    value: "nosniff" },
      { key: "Referrer-Policy",           value: "origin-when-cross-origin" },
      { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ];
    return [
      { source: "/(.*)", headers: sec },
      { source: "/_next/static/:p*", headers: [{ key: "Cache-Control", value: "public,max-age=31536000,immutable" }] },
      { source: "/api/:p*", headers: [...sec, { key: "Cache-Control", value: "no-store" }] },
    ];
  },
  async redirects() {
    return [
      { source: "/app",     destination: "/dashboard", permanent: true },
      { source: "/sign-in", destination: "/login",     permanent: true },
      { source: "/sign-up", destination: "/register",  permanent: true },
    ];
  },
  eslint:     { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
};
