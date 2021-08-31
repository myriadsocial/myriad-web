import '@fontsource/mulish';

import {createTheme} from '@material-ui/core/styles';

const primaryPurple = '#6E3FC3';
const primaryOrange = '#FFC857';

const theme = createTheme({
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
