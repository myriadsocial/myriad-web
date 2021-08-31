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

const textRegular = 400;
const textMedium = 600;

const textXs = 10;
const textSm = 12;
const textBs = 14;
const textLg = 18;
const textXl = 22;
const text2Xl = 28;
const text3Xl = 34;

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
    fontWeightRegular: textRegular,
    fontWeightMedium: textMedium,
    subtitle1: {
      fontSize: textXs,
    },
    caption: {
      fontSize: textSm,
    },
    body1: {
      fontSize: textBs,
    },
    h4: {
      fontSize: textLg,
    },
    h3: {
      fontSize: textXl,
    },
    h2: {
      fontSize: text2Xl,
    },
    h1: {
      fontSize: text3Xl,
    },
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
        fontSize: 14,
      },
    },
  },
});

export default theme;
