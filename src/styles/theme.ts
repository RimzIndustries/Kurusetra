import { createGlobalStyle } from 'styled-components';

export const defaultTheme = {
  primary: '#e0e5ec',
  secondary: '#f0f5fa',
  accent: '#4a90e2',
  text: '#2c3e50',
  shadow: 'rgba(163, 177, 198, 0.6)',
  light: 'rgba(255, 255, 255, 0.5)',
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
};

export const darkTheme = {
  primary: '#1a1a2e',
  secondary: '#16213e',
  accent: '#4a90e2',
  text: '#ffffff',
  shadow: 'rgba(0, 0, 0, 0.3)',
  light: 'rgba(255, 255, 255, 0.1)',
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
};

export const raceThemes = {
  ksatriya: {
    light: {
      ...defaultTheme,
      primary: '#e0e5ec',
      secondary: '#f0f5fa',
      accent: '#4a90e2',
      text: '#2c3e50',
      shadow: 'rgba(163, 177, 198, 0.6)',
      light: 'rgba(255, 255, 255, 0.5)',
    },
    dark: {
      ...darkTheme,
      primary: '#1a1a2e',
      secondary: '#16213e',
      accent: '#4a90e2',
      text: '#ffffff',
      shadow: 'rgba(0, 0, 0, 0.3)',
      light: 'rgba(255, 255, 255, 0.1)',
    },
  },
  wanamarta: {
    light: {
      ...defaultTheme,
      primary: '#e0f2e9',
      secondary: '#f0faf5',
      accent: '#2ecc71',
      text: '#1e8449',
      shadow: 'rgba(46, 204, 113, 0.3)',
      light: 'rgba(255, 255, 255, 0.5)',
    },
    dark: {
      ...darkTheme,
      primary: '#1a2f1a',
      secondary: '#1e3e1e',
      accent: '#2ecc71',
      text: '#ffffff',
      shadow: 'rgba(0, 0, 0, 0.3)',
      light: 'rgba(255, 255, 255, 0.1)',
    },
  },
  wirabumi: {
    light: {
      ...defaultTheme,
      primary: '#f2e0d4',
      secondary: '#faf0e6',
      accent: '#e67e22',
      text: '#8e44ad',
      shadow: 'rgba(230, 126, 34, 0.3)',
      light: 'rgba(255, 255, 255, 0.5)',
    },
    dark: {
      ...darkTheme,
      primary: '#2a1a1a',
      secondary: '#3e1e1e',
      accent: '#e67e22',
      text: '#ffffff',
      shadow: 'rgba(0, 0, 0, 0.3)',
      light: 'rgba(255, 255, 255, 0.1)',
    },
  },
  jatayu: {
    light: {
      ...defaultTheme,
      primary: '#e0e0f2',
      secondary: '#f0f0fa',
      accent: '#9b59b6',
      text: '#5d3d8e',
      shadow: 'rgba(155, 89, 182, 0.3)',
      light: 'rgba(255, 255, 255, 0.5)',
    },
    dark: {
      ...darkTheme,
      primary: '#1a1a2a',
      secondary: '#1e1e3e',
      accent: '#9b59b6',
      text: '#ffffff',
      shadow: 'rgba(0, 0, 0, 0.3)',
      light: 'rgba(255, 255, 255, 0.1)',
    },
  },
};

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: ${props => props.theme.primary};
    color: ${props => props.theme.text};
    transition: all 0.3s ease;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }

  input, select, textarea {
    border: none;
    outline: none;
    background: ${props => props.theme.primary};
    color: ${props => props.theme.text};
    transition: all 0.3s ease;
  }
`; 