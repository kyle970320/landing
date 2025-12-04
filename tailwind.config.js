/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "var(--color-main)",
        sub: "var(--color-sub)",
        mainTitle: "var(--color-main-title)",
        subTitle: "var(--color-sub-title)",
        mainBg: "var(--color-main-bg)",
      }
    }
  }
}