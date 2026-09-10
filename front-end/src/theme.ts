export interface AppTheme {
  colors: {
    ink: string;
    muted: string;
    paper: string;
    surface: string;
    line: string;
    moss: string;
    mossDark: string;
    mint: string;
    coral: string;
    warning: string;
    danger: string;
  };
  fonts: { body: string; display: string };
  radii: { sm: string; md: string; pill: string };
  shadows: { soft: string };
}

export const theme: AppTheme = {
  colors: {
    ink: '#17211b',
    muted: '#68736a',
    paper: '#fbfaf5',
    surface: '#ffffff',
    line: '#e4e8df',
    moss: '#356859',
    mossDark: '#244a40',
    mint: '#dceee3',
    coral: '#e87856',
    warning: '#9a5d13',
    danger: '#b63a3a',
  },
  fonts: { body: "'DM Sans', sans-serif", display: "'Fraunces', serif" },
  radii: { sm: '8px', md: '16px', pill: '999px' },
  shadows: { soft: '0 12px 30px rgba(23, 33, 27, 0.08)' },
};

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
