import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite que el dev server sirva sus recursos cuando se entra por una IP de
  // LAN, un nombre .local o Tailscale (sin esto Next bloquea los chunks en
  // desarrollo y la página queda con una versión vieja sin hidratar). Solo
  // aplica a `next dev`.
  allowedDevOrigins: ["192.168.*.*", "*.local", "100.*.*.*", "*.ts.net", "herdr-box"],
};

export default nextConfig;
