import '@fontsource/mulish';

import {createTheme, alpha} from '@material-ui/core/styles';

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

//Neutral colors
const neutral20 = '#F5F5F5';
const neutral30 = '#EDEDED';
const neutral50 = '#C2C2C2';
const neutral70 = '#757575';
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
//const textSecondary = '#898888';
const textSecondary = neutral70;

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
    fontWeightBold: textBold,
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
    MuiListItem: {
      root: {
        '&:nth-child(even)': {
          backgroundColor: '#F2F2F4',
        },
      },
      container: {
        width: '100%',

        '&:nth-child(even)': {
          backgroundColor: '#F2F2F4',
        },
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
        border: `1px solid ${primaryPurple}`,
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
        border: `1px solid ${borderPurple}`,
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
        border: `1px solid ${primaryOrange}`,
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
        fill: 'currentColor',
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

    MuiMenuItem: {
      root: {
        '&:hover': {
          backgroundColor: alpha('#FFC857', 0.15),
        },
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
