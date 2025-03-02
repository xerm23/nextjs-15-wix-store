/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:    {
        staleTimes:{
            dynamic: 30
        }
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'static.wixstatic.com',
            pathname: '/media/**',
          },
        ],
        minimumCacheTTL: 3600
      },
};

export default nextConfig;
