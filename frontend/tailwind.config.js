/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "orange-bottom-right": "10px 10px 30px rgba(255, 165, 0, 0.5)",
      },
      colors: {
        customHsl: "hsl(242deg 88.4% 66.3% / 7%)",
      },
    },
    fontFamily: {
      body: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      sans: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".modern-input": {
          width: "100%",
          padding: "0.75rem 1rem",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "0.5rem",
          color: "white",
          placeholderColor: "rgba(186, 104, 200, 0.6)",
          outline: "none",
          transition: "all 0.3s ease",
          "&:focus": {
            borderColor: "#6366F1", // Indigo-500
            boxShadow: "0 0 8px rgba(99, 102, 241, 0.5)",
          },
        },
      });
    },
  ],
};
