module.exports = {
  content: ['./src/**/*.{html,ts}'],
  corePlugins: {
    preflight: false,
    container: false,
  },
  blocklist: ['collapse', 'contents'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#E8F8F4',
          500: '#18BC9C',
          600: '#14A589',
          700: '#0E7C67',
          800: '#0B6353',
        },
        navy: {
          800: '#2C3E50',
        },
      },
    },
  },
  plugins: [],
};
