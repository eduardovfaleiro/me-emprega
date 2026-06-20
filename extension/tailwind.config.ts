import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        geist: ["Geist", "-apple-system", "Segoe UI", "sans-serif"],
        "space-grotesk": ["Space Grotesk", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#059669",
          hover: "#047857",
        },
      },
      width: {
        popup: "380px",
      },
    },
  },
  plugins: [],
};
export default config;
