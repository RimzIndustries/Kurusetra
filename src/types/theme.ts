import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    shadow: string;
    light: string;
    success: string;
    error: string;
    warning: string;
    info: string;
  }
} 