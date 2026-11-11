/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export: the whole site is built into ./out, which Cloudflare Pages serves as-is.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
