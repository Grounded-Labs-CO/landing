import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite que el dev server sirva sus recursos cuando se entra por una IP de
  // LAN o un nombre .local (sin esto Next bloquea los chunks en desarrollo y la
  // página queda sin hidratar). Solo aplica a `next dev`.
  allowedDevOrigins: ["192.168.*.*", "*.local"],
};

export default nextConfig;
