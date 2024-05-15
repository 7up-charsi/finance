import {
  createColorScale,
  createTheme,
  registerAllStyles,
} from '@typeweave/theme';
import type { Config } from 'tailwindcss';
import { mauve, mauveDark } from '@radix-ui/colors';

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    registerAllStyles(),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    createTheme({
      themes: {
        light: { colors: { muted: createColorScale(mauve) } },
        dark: { colors: { muted: createColorScale(mauveDark) } },
      },
    }),
  ],
};
export default config;

