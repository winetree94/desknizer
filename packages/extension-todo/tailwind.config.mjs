import baseConfigs from '@desknizer/ui/tailwind.config.mjs';

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfigs,
  content: ['./index.html', './widget.html', './src/**/*.{js,ts,jsx,tsx}'],
};
