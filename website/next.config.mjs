/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  poweredByHeader: false,
  webpack: (config) => {
    config.externals.push({ 'pg-native': 'commonjs pg-native' });
    return config;
  },
};

export default nextConfig;
