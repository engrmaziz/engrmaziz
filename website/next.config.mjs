/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.externals.push({ 'pg-native': 'commonjs pg-native' });
    return config;
  },
};

export default nextConfig;
