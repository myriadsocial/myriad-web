import '@fontsource/mulish';

import {createTheme, alpha} from '@material-ui/core/styles';
import {BreakpointValues} from '@material-ui/core/styles/createBreakpoints';

declare module '@material-ui/core/styles' {
  interface Theme {
    status: {
      success: {
        main: string;
        surface: string;
        pressed: string;
      };
      warning: {
        main: string;
      };
      danger: {
        main: string;
        surface: string;
        pressed: string;
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
        surface: string;
        pressed: string;
      };
      warning?: {
        main: string;
      };
      danger?: {
        main: string;
        surface: string;
        pressed: string;
      };
      info?: {
        main: string;
      };
    };
  }
}

//Neutral colors
const neutral20 = '#F5F5F5';
const neutral30 = '#EDEDED';
const neutral50 = '#C2C2C2';
//const neutral70 = '#757575';
const neutral90 = '#404040';

//Primary colors
const primaryPurple = '#7342CC';
//const primaryPurpleHover = '#7647CC';
const primaryOrange = '#FFD24D';

const primaryGreen = '#39BF87';
const primaryRed = '#FE3333';
const primaryBlue = '#1070CA';

// text colors
const textPrimary = '#12130F';
const textSecondary = '#898888';
//const textSecondary = neutral70;

//Surface colors
const surfacePurple = '#EBE0FF';
// const surfaceOrange = '#FFF2CC';

const surfaceGreen = '#DAF1E6';
const surfaceRed = '#FFD7D7';
// const surfaceBlue = '#CFE2F4';

// Pressed colors
const pressedGreen = '#268054';
const pressedRed = '#A62121';

//Border colors
const borderPurple = '#DECCFF';
// const borderOrange = '#FFECB2';

// const borderGreen = '#C2E7D5';
// const borderRed = '#FFBCBC';
// const borderBlue = '#AFCFED';

//Font weight
const textRegular = 400;
const textMedium = 600;
const textBold = 700;

//Font size
const textXs = 10;
const textSm = 12;
const textBs = 14;
const textMd = 16;
const textLg = 18;
const textXl = 22;
const text2Xl = 28;
const text3Xl = 34;

//Button State Properties
const DISABLED_PROPS = {
  backgroundColor: neutral50,
  border: 'none',
  color: '#FFF',
};

const {breakpoints} = createTheme();

const breakpointsValue: BreakpointValues = {
  xs: 500,
  sm: 960,
  md: 1280,
  lg: 1366,
  xl: 1920,
};

const theme = createTheme({
  breakpoints: {
    values: breakpointsValue,
  },
  status: {
    success: {
      main: primaryGreen,
      surface: surfaceGreen,
      pressed: pressedGreen,
    },
    warning: {
      main: primaryOrange,
    },
    danger: {
      main: primaryRed,
      surface: surfaceRed,
      pressed: pressedRed,
    },
    info: {
      main: primaryBlue,
    },
  },

  palette: {
    background: {
      default: '#F6F7FC',
      paper: '#FFF',
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
    fontWeightBold: textBold,
    subtitle1: {
      fontSize: textXs,
    },
    subtitle2: {
      fontSize: textSm,
    },
    caption: {
      fontSize: textSm,

      [breakpoints.down(breakpointsValue.lg)]: {
        fontSize: textXs,
      },
      [breakpoints.down(breakpointsValue.xs)]: {
        fontSize: textBs,
        fontWeight: textMedium,
      },
    },
    body1: {
      fontSize: textBs,

      [breakpoints.down(breakpointsValue.lg)]: {
        fontSize: textSm,
      },
    },
    h6: {
      fontSize: textBs,
      fontWeight: 600,
    },
    h5: {
      fontSize: textMd,

      [breakpoints.down(breakpointsValue.lg)]: {
        fontSize: textBs,
      },
    },
    h4: {
      fontSize: textLg,

      [breakpoints.down(breakpointsValue.lg)]: {
        fontSize: textMd,
      },
    },
    h3: {
      fontSize: textXl,

      [breakpoints.down(breakpointsValue.lg)]: {
        fontSize: textLg,
      },
    },
    h2: {
      fontSize: text2Xl,

      [breakpoints.down(breakpointsValue.lg)]: {
        fontSize: textXl,
      },
    },
    h1: {
      fontSize: text3Xl,

      [breakpoints.down(breakpointsValue.lg)]: {
        fontSize: text2Xl,
      },
    },
  },

  overrides: {
    MuiListItem: {
      container: {
        width: '100%',
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        boxSizing: 'border-box',
        borderRadius: 20,
        width: 280,
        height: 40,
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
        backgroundColor: primaryPurple,
        color: '#FFF',
        '&:hover': {
          backgroundColor: primaryPurple,
        },
        '&:focus': {
          backgroundColor: '#7647CC',
          border: `3px solid rgba(115, 66, 204, 0.2)`,
        },
        '&:active': {
          backgroundColor: '#452680',
        },
        '&:disabled': DISABLED_PROPS,
      },
      containedSecondary: {
        backgroundColor: `${surfacePurple}`,
        color: primaryPurple,
        '&:hover': {
          backgroundColor: surfacePurple,
        },
        '&:focus': {
          border: `3px solid rgba(115, 66, 204, 0.2)`,
        },
        '&:active': {
          backgroundColor: `rgba(115, 66, 204, 0.2)`,
        },
        '&:disabled': DISABLED_PROPS,
      },
      outlinedPrimary: {
        border: `2px solid ${borderPurple}`,
        backgroundColor: '#FFF',
        '&:hover': {
          backgroundColor: neutral20,
          border: `2px solid ${borderPurple}`,
        },
        '&:focus': {
          backgroundColor: neutral20,
          border: `3px solid rgba(115, 66, 204, 0.2)`,
        },
        '&:active': {
          backgroundColor: neutral30,
          border: `2px solid ${borderPurple}`,
        },
        '&:disabled': DISABLED_PROPS,
      },
      outlinedSecondary: {
        border: `2px solid ${primaryOrange}`,
        backgroundColor: '#FFF',
        color: neutral90,
        '&:hover': {
          backgroundColor: '#FFC85733',
          border: `2px solid ${primaryOrange}`,
        },
        '&:active': {
          backgroundColor: '#EBCF7A',
          border: `2px solid ${primaryOrange}`,
        },
        '&:disabled': DISABLED_PROPS,
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

    MuiSnackbarContent: {
      root: {
        backgroundColor: '#FFF',
        boxShadow: `0px 2px 10px rgba(71, 184, 129, 0.1)`,
        borderRadius: 10,
      },
    },

    MuiSvgIcon: {
      root: {
        fill: 'none',
      },
      colorError: {
        color: primaryRed,
      },
    },

    MuiFormControl: {
      root: {
        marginBottom: 30,
      },
    },

    MuiChip: {
      root: {
        borderRadius: 5,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: 'none',
        border: `1px solid ${primaryPurple}`,
      },
      label: {
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 18,
      },
      deleteIcon: {
        color: '#FE3636',
        marginTop: 2,
      },
    },

    MuiMenu: {
      list: {
        minWidth: 170,
      },
      paper: {
        minWidth: 170,
      },
    },

    MuiMenuItem: {
      root: {
        '&:hover': {
          backgroundColor: alpha('#FFC857', 0.15),
        },
      },
    },

    MuiPaper: {
      elevation1: {
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
      },
    },
  },

  props: {
    MuiButton: {
      disableElevation: true,
    },

    MuiSnackbar: {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    },
  },
});

export default theme;
