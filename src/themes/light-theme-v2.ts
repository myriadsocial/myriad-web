import '@fontsource/mulish';

import {createTheme} from '@material-ui/core/styles';

declare module '@material-ui/core/styles' {
  interface Theme {
    status: {
      success: {
        main: string;
      };
      warning: {
        main: string;
      };
      info: {
        main: string;
      };
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      success?: {
        main: string;
      };
      warning?: {
        main: string;
      };
      info?: {
        main: string;
      };
    };
  }
}

const primaryPurple = '#6E3FC3';
const primaryOrange = '#FFC857';

const primaryGreen = '#39BF87';
const primaryRed = '#FE3333';
const primaryBlue = '#1070CA';

const theme = createTheme({
  status: {
    success: {
      main: primaryGreen,
    },
    warning: {
      main: primaryRed,
    },
    info: {
      main: primaryBlue,
    },
  },
  palette: {
    primary: {
      main: primaryPurple,
      contrastText: '#FFFFF',
    },
    secondary: {
      main: primaryOrange,
      contrastText: '#FFFFF',
    },
  },
  typography: {
    fontFamily: ['Mulish', 'serif'].join(','),
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
      },
    },
  },
});

export default theme;
