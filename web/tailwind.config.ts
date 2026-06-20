// Note: Tailwind v4 uses CSS-first configuration (see app/globals.css).
// This file is kept for editor tooling compatibility.
// - darkMode is configured via @custom-variant in globals.css
// - font families are configured via @theme in globals.css
// - typography plugin is loaded via @plugin in globals.css
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-mode="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "space-grotesk": ["'Space Grotesk'", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
