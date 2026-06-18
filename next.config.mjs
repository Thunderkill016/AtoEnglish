/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Tách biệt thư mục build của Dev Server (.next-dev) và Production Build (.next)
  // để tránh xung đột làm lỗi Webpack cache dẫn đến mất CSS khi chạy build song song.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};

export default nextConfig;
