import type { NextConfig } from "next";

// In dev, proxy /api/* to the FastAPI backend so the browser stays same-origin
// (no CORS). Override the target with BACKEND_URL when needed.
const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
