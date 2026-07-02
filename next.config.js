/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://tumahelper-prod-api-550454647742.europe-west1.run.app/api/:path*',
      },
    ];
  },
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

