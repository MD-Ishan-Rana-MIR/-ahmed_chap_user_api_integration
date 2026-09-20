/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "360px",
        md: "420px",
        lg: "680px",
      },
      fontFamily: {
        "Manrope-Bold.ttf": ["Manrope-Bold"],
        "Manrope-ExtraBold.ttf": ["Manrope-ExtraBold"],
        "Manrope-ExtraLight.ttf": ["Manrope-ExtraLight"],
        "Manrope-Light.ttf": ["Manrope-Light"],
        "Manrope-Medium.ttf": ["Manrope-Medium"],
        "Manrope-Regular.ttf": ["Manrope-Regular"],
        "Manrope-SemiBold.ttf": ["Manrope-SemiBold"],
      },
      colors: {
        primaryText: "#fff",
        blackText: "#222222",
        grayText: "#666666",
      },
      backgroundColor: {
        btnColor: "#0474DA",
        blackBg: "#fff",
        bgOlive: "#5B7410",
      },
      borderColor: {
        primaryBorder: "#0474DA",
        lightBorder: "#E6F4FE",
        cardBorder: "#344ceb",
        seconderBoder: "#0058AA",
      },
      fontSize: {
        small: "13px",
        textLg: "19px",
        textTwoXl: "23px",
      },
    },
  },
  plugins: [],
};