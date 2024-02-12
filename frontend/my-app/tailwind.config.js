module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1fb6ff',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
