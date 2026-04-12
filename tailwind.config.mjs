/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mac: ['"ChicagoFLF"', "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
