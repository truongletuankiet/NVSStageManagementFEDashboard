/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "**", // Cho phép tất cả các domain
      },
    ],
  },
};

module.exports = nextConfig;
