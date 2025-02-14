import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // swcMinify: false, 
  images: {
    localPatterns: [
      {
        pathname: '/assets/images/**',
        search: '',
      },
    ],
    remotePatterns: [
      {
        hostname: 'picsum.photos',
      },
    ],
    domains: ['lh3.googleusercontent.com', 'other-domain.com', 'avatars.githubusercontent.com']
  },
};

export default nextConfig;
