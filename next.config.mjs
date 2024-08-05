// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "ik.imagekit.io", // Add this line
    ],
  },
};

export default nextConfig;
