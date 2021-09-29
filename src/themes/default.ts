import {createTheme} from '@material-ui/core/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    type: 'light',
    background: {
      default: '#E5E5E5',
    },
    primary: {
      main: '#6E3FC3',
    },
    secondary: {
      main: '#FFC857',
    },
    text: {
      primary: '#12130F',
      secondary: '#898888',
    },
  },
  typography: {
    fontSize: 14,
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        a: {
          textDecoration: 'none',
          color: '#6E3FC3',
        },
        '*::-webkit-scrollbar': {
          width: '0.4em',
        },
        '*::-webkit-scrollbar-track': {
          '-webkit-box-shadow': 'inset 0 0 6px #898888',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#6E3FC3',
          outline: '1px solid #898888',
        },
      },
    },

    MuiIconButton: {
      root: {
        fontSize: 18,
      },

      colorPrimary: {
        '&:hover': {
          backgroundColor: 'inherit',
        },
      },
    },
  },
});

export default theme;
