import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    fontSize: {
      sm: "1.2rem",
      base: "1.6rem",
      xl: "2rem",
      "2xl": "2.4rem",
      "3xl": "3rem",
      "4xl": "3.6rem",
      "5xl": "5rem",
    },
  },
} satisfies Config;
