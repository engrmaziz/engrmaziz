/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next_build4',
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.externals.push({ 'pg-native': 'commonjs pg-native' });
    return config;
  },
};

export default nextConfig;
