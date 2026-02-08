import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  clientsClaim: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\/_next\/static\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "next-static",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60,
        },
      },
    },
  ],
});

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default withPWA(nextConfig);
