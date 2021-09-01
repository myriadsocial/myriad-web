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

//Primary colors
const primaryPurple = '#7342CC';
const primaryOrange = '#FFD24D';

const primaryGreen = '#39BF87';
const primaryRed = '#FE3333';
const primaryBlue = '#1070CA';

// text colors
const textPrimary = '#12130F';
const textSecondary = '#898888';

//Surface colors
const surfacePurple = '#EBE0FF';
// const surfaceOrange = '#FFF2CC';

// const surfaceGreen = '#DAF1E6';
// const surfaceRed = '#FFD7D7';
// const surfaceBlue = '#CFE2F4';

//Border colors
const borderPurple = '#DECCFF';
// const borderOrange = '#FFECB2';

// const borderGreen = '#C2E7D5';
// const borderRed = '#FFBCBC';
// const borderBlue = '#AFCFED';

//Font weight
const textRegular = 400;
const textMedium = 600;

//Font size
const textXs = 10;
const textSm = 12;
const textBs = 14;
const textMd = 16;
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
    background: {
      default: '#121212',
    },
    primary: {
      main: primaryPurple,
      contrastText: '#FFFFF',
    },
    secondary: {
      main: primaryOrange,
      contrastText: '#FFFFF',
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
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
    h5: {
      fontSize: textMd,
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
        boxSizing: 'border-box',
        borderRadius: 20,
      },
      sizeSmall: {
        width: 180,
        height: 40,
      },
      sizeLarge: {
        width: 583,
        height: 40,
      },
      containedPrimary: {
        border: `1px solid ${primaryPurple}`,
        backgroundColor: primaryPurple,
        color: '#FFF',
      },
      containedSecondary: {
        border: `1px solid ${borderPurple}`,
        backgroundColor: `${surfacePurple}`,
        color: primaryPurple,
      },
      outlinedPrimary: {
        border: `1px solid ${primaryPurple}`,
        backgroundColor: '#FFF',
      },
      outlinedSecondary: {
        border: `1px solid ${primaryOrange}`,
        backgroundColor: '#FFF',
      },
    },

    MuiIconButton: {
      root: {
        fontSize: '1.2rem',
      },

      colorPrimary: {
        '&:hover': {
          backgroundColor: 'inherit',
        },
      },
    },
  },
  props: {
    MuiButton: {
      disableElevation: true,
    },
  },
});

export default theme;
