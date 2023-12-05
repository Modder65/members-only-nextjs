// @ts-check
/** 
 * @type {import('next').NextConfig}
 * 
 * The NextConfig type import helps with auto-completion and type checking
 * in modern IDEs, making your configuration easier to work with.
 */

const nextConfig = {
  // The 'experimental' key is used for enabling experimental features in Next.js.
  // These features are not yet stable and might change in future releases.
  experimental: {
    // 'swcPlugins' are plugins used with the SWC compiler, which Next.js uses for super-fast builds.
    // Here, 'next-superjson-plugin' is added to enhance JSON serialization in Next.js.
    swcPlugins: [
      ["next-superjson-plugin", {}]
    ]
  },

  // The 'images' key is used for configuring how Next.js handles images.
  images: {
    // 'remotePatterns' allows you to specify external domains from which images can be loaded.
    // This replaces the deprecated 'domains' configuration.
    // Images from these domains can be optimized by Next.js' Image Optimization API.
    remotePatterns: [
      // Allows images from Cloudinary.
      { hostname: 'res.cloudinary.com' },
      // Allows images from GitHub avatars.
      { hostname: 'avatars.githubusercontent.com' },
      // Allows images from Google Hosted Libraries.
      { hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

// Export the configuration object to be used by Next.js.
module.exports = nextConfig;
