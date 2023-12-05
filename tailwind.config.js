// 'content' specifies the paths to all of your template files.
// Tailwind will use these paths to purge unused styles in production builds.
const content = [
  // Include all JavaScript, TypeScript, JSX, TSX, and MDX files in the 'pages' directory.
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  // Include the same file types in the 'components' directory.
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  // Include these file types in the 'app' directory as well.
  './app/**/*.{js,ts,jsx,tsx,mdx}',
];

// The 'theme' section is where you define your custom Tailwind styles.
const theme = {
  // 'extend' allows you to add new utilities without overriding existing ones.
  extend: {},
};

// 'plugins' are used to add additional functionality or custom components to Tailwind.
const plugins = [
  // '@tailwindcss/forms' is a plugin for styling form elements.
  // The 'strategy' option set to 'class' means it will use class-based styles instead of element-based.
  require("@tailwindcss/forms")({
    strategy: 'class'
  })
];

// Define the Tailwind CSS configuration object.
const config = {
  content,
  theme,
  plugins
};

// Export the configuration object to be used by Tailwind CSS.
export default config;
