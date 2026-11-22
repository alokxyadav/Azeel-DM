
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter","system-ui","sans-serif"] },
      colors: {
        brand: { 50:"#eef2ff",100:"#e0e7ff",200:"#c7d2fe",300:"#a5b4fc",400:"#818cf8",500:"#6366f1",600:"#4f46e5",700:"#4338ca",800:"#3730a3",900:"#312e81" },
        accent: { 400:"#e879f9",500:"#d946ef",600:"#c026d3",700:"#a21caf" },
        teal:   { 400:"#2dd4bf",500:"#14b8a6",600:"#0d9488" },
      },
      boxShadow: {
        brand:    "0 4px 14px rgba(79,70,229,0.38),0 1px 3px rgba(0,0,0,0.1)",
        "brand-lg":"0 8px 28px rgba(79,70,229,0.45),0 2px 6px rgba(0,0,0,0.1)",
        card:     "0 1px 4px rgba(0,0,0,0.05),0 1px 2px rgba(0,0,0,0.03)",
        "card-lg":"0 6px 24px rgba(79,70,229,0.08),0 2px 8px rgba(0,0,0,0.04)",
      },
      animation: {
        float:  "float 3.5s ease-in-out infinite",
        pulse2: "pulseSoft 2s ease-in-out infinite",
        shimmer:"shimmer 1.8s ease-in-out infinite",
        "fade-up":"fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "slide-in":"slideIn 0.25s cubic-bezier(0.22,1,0.36,1) both",
      },
      keyframes: {
        float:    {"0%,100%":{transform:"translateY(0)"},"50%":{transform:"translateY(-8px)"}},
        pulseSoft:{"0%,100%":{opacity:"1"},"50%":{opacity:"0.4"}},
        shimmer:  {"0%":{backgroundPosition:"-200% 0"},"100%":{backgroundPosition:"200% 0"}},
        fadeUp:   {"from":{opacity:"0",transform:"translateY(20px)"},"to":{opacity:"1",transform:"translateY(0)"}},
        slideIn:  {"from":{opacity:"0",transform:"translateX(-12px)"},"to":{opacity:"1",transform:"translateX(0)"}},
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
