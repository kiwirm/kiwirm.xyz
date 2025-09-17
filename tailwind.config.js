module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        fg: "var(--color-fg)",
        "fg-secondary": "var(--color-fg-secondary)",
        red: "var(--color-red)",
        green: "var(--color-green)",
        blue: "var(--color-blue)",
        yellow: "var(--color-yellow)",
        "red-secondary": "var(--color-red-secondary)",
        "green-secondary": "var(--color-green-secondary)",
        "blue-secondary": "var(--color-blue-secondary)",
        "yellow-secondary": "var(--color-yellow-secondary)",
      },
      fontFamily: {
        "fira-code": [
          '"Fira Code"',
          '"Fira Mono"',
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          "monospace",
        ],
      },
      width: {
        "stroke-node-hover": "var(--stroke-node-hover)",
      },
      borderWidth: {
        "node-hover": "var(--stroke-node-hover)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
