import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "bngimmo.com", pathname: "/images/**" }],
  },
};
export default nextConfig;
