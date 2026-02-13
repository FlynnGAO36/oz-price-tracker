import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignore Puppeteer dynamic requires that can't be statically analyzed
      config.externals.push('puppeteer-extra', 'puppeteer-extra-plugin-stealth');
    }
    
    return config;
  },
};

export default nextConfig;
