import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com','lh3.googleusercontent.com'],  // cloudinary image load এর জন্য allow
  },
experimental: {
  // Add supported experimental options here if needed
},
};

export default nextConfig;
