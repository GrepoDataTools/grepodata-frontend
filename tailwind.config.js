const defaultTheme = require('tailwindcss/defaultTheme');

const remToPx = (value) => {
  if (typeof value === 'string') {
    return value.replace(/(-?\d*\.?\d+)rem/g, (match, rem) => `${parseFloat(rem) * 16}px`);
  }
  if (Array.isArray(value)) {
    return value.map(remToPx);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, remToPx(entry)]));
  }
  return value;
};

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  corePlugins: {
    preflight: false,
    container: false,
  },
  blocklist: ['collapse', 'contents'],
  theme: {
    spacing: remToPx(defaultTheme.spacing),
    fontSize: remToPx(defaultTheme.fontSize),
    lineHeight: remToPx(defaultTheme.lineHeight),
    borderRadius: remToPx(defaultTheme.borderRadius),
    columns: remToPx(defaultTheme.columns),
    maxWidth: (utils) => remToPx(defaultTheme.maxWidth(utils)),
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
        report: {
          friendly: '#2A78D6',
          enemy: '#EB6834',
          spy: '#1BAF7A',
          other: '#94A3B8',
        },
      },
    },
  },
  plugins: [],
};
