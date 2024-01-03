/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
import colors from "tailwindcss/colors";

const withAlphaValue = (varName) => `hsl(var(--${varName}) / <alpha-value>)`;

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: "var(--font-sans)",
    },
    extend: {
      colors: {
        primary: colors.emerald,
        secondary: colors.purple,
        foreground: {
          brand: withAlphaValue("foreground-brand-color"),
          accent: withAlphaValue("foreground-accent-color"),
        },
        surface: {
          brand: {
            1: withAlphaValue("surface-brand-1-color"),
            2: withAlphaValue("surface-brand-2-color"),
          },
          accent: {
            1: withAlphaValue("surface-accent-1-color"),
          },
        },
        success: withAlphaValue("success-color"),
        error: withAlphaValue("error-color"),
      },
    },
  },
  plugins: [typography],
};
