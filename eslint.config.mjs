import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["pm-s3-images.s3.us-east-2.amazonaws.com", "scontent.fsgn1-1.fna.fbcdn.net", "upload.wikimedia.org"] // Thêm domain Facebook
  },
};

module.exports = nextConfig;


export default nextConfig;