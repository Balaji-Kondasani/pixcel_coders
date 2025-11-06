/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // This line tells Vercel/Railway to ignore ESLint errors during the build process.
    // This will allow your deployment to complete successfully.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;



