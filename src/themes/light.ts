import {createTheme} from '@material-ui/core/styles';

const defaultTheme = createTheme();

// Create a theme instance.
const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#8629E9',
      light: '#F2F2F4',
      dark: '#4B4851',
    },
    secondary: {
      main: '#A25AEE',
      light: '#BB87F3',
      dark: '#8629E9',
    },
    background: {
      default: '#F2F2F4',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#4B4851',
      secondary: '#828282',
    },
  },
  typography: {
    fontFamily: `"Mulish", ${defaultTheme.typography.fontFamily}`,
    fontSize: 12,
    caption: {
      fontSize: 14,
      fontWeight: 400,
    },
    h4: {
      fontSize: 18,
      fontWeight: 700,
      lineHeight: '22px',
    },
    h5: {
      fontSize: 16,
      fontWeight: 300,
    },
    h6: {
      fontSize: 12,
      fontWeight: 'bold',
    },
  },

  overrides: {
    MuiCssBaseline: {
      '@global': {
        a: {
          textDecoration: 'none',
          color: '#8629E9',
        },
        '*::-webkit-scrollbar': {
          width: '0.4em',
        },
        '*::-webkit-scrollbar-track': {
          '-webkit-box-shadow': 'inset 0 0 6px #171717',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#8629E9',
          outline: '1px solid #424242',
        },
      },
    },

    // TOOLBAR
    MuiToolbar: {
      gutters: {
        paddingRight: 32,
        paddingLeft: 32,
        [defaultTheme.breakpoints.up('md')]: {
          paddingRight: 32,
          paddingLeft: 32,
        },
      },
    },

    // DIALOG COMPONENT
    MuiDialog: {
      root: {
        '& .MuiPaper-root, & .MuiCardHeader-root': {
          background: '#F2F2F4',
        },
      },
      scrollPaper: {
        alignItems: 'flex-start',
      },
    },
    MuiDialogTitle: {
      root: {
        background: '#8629E9',
        fontWeight: 700,
        fontSize: 18,
        lineHeight: 23,
        color: '#FFFFFF',
      },
    },
    MuiDialogContent: {
      root: {
        background: '#F2F2F4',
        padding: 8,
      },
    },

    // AVATAR & ICON
    MuiAvatar: {
      root: {
        width: 32,
        height: 32,
      },
    },

    // FORM & INPUT
    MuiInputBase: {
      root: {
        color: 'inherit',
        background: '#F7F7F7',
        borderRadius: 8,
      },
    },
    MuiInput: {
      inputTypeSearch: {
        background: '#C4C4C4',
      },
      inputMultiline: {
        background: '#FFFFFF',
      },
    },
    MuiFormControlLabel: {
      label: {
        fontSize: 12,
        padding: '0 4px',
      },
    },

    // BUTTON
    MuiButton: {
      root: {
        textTransform: 'capitalize',
      },
      sizeSmall: {
        marginLeft: 4,
        marginRight: 4,
        padding: 4,
        fontSize: 10,
        textTransform: 'capitalize',
      },
      sizeLarge: {
        borderRadius: 8,
        marginBottom: 16,
      },
      containedPrimary: {
        backgroundColor: '#8629E9',
      },
      containedSecondary: {
        backgroundColor: '#B1AEB7',
      },
    },

    // MENU & LIST
    MuiList: {
      root: {
        margin: '8px 0',
        background: 'transparent',
      },
    },
    MuiListItem: {
      root: {
        '&:nth-child(even)': {
          backgroundColor: '#F2F2F4',
        },
      },
      container: {
        '&:nth-child(even)': {
          backgroundColor: '#F2F2F4',
        },
      },
    },
    MuiMenu: {
      paper: {
        backgroundColor: '#C4C4C4',
      },
    },
    MuiMenuItem: {
      root: {
        backgroundColor: '#C4C4C4',
        '&:nth-child(even)': {
          backgroundColor: '#C4C4C4',
        },
      },
    },

    // CARD
    MuiCard: {
      root: {
        background: 'rgba(255, 255, 255, 0.8)',
        border: 0,
      },
    },
    MuiCardHeader: {
      root: {
        background: '#FFFFFF',
        padding: 16,
        height: 88,
      },
    },
    MuiCardActions: {
      root: {
        background: '#FFFFFF',
        padding: 8,
      },
    },

    MuiTab: {
      textColorPrimary: {
        '&.Mui-selected': {
          background: '#EEEEEE',
          color: '#000000',
        },
      },
    },

    MuiPaper: {
      rounded: {
        borderRadius: 8,
      },
    },

    MuiAccordion: {
      rounded: {
        background: 'transparent',
        '&:last-child': {
          borderBottomLeftRadius: defaultTheme.spacing(1),
          borderBottomRightRadius: defaultTheme.spacing(1),
        },
        '&:first-child': {
          borderTopLeftRadius: defaultTheme.spacing(1),
          borderTopRightRadius: defaultTheme.spacing(1),
        },
      },
    },
    MuiAccordionSummary: {
      root: {
        background: '#8629E9',
        borderRadius: 8,
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 700,

        '&.Mui-expanded': {
          minHeight: 48,
        },
      },
      content: {
        '&.Mui-expanded': {
          margin: defaultTheme.spacing(1.5, 0),
        },
      },
    },

    MuiBottomNavigationAction: {
      root: {
        color: '#B1AEB7',

        '& .MuiSvgIcon-root': {
          height: defaultTheme.spacing(3),
          width: defaultTheme.spacing(3),
        },
      },
    },
  },
});

export default theme;
