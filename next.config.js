/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "*.supabase.co", "images.unsplash.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

module.exports = nextConfig;
