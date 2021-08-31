import green from '@material-ui/core/colors/green';
import purple from '@material-ui/core/colors/purple';
import {createTheme} from '@material-ui/core/styles';

const primaryGreen = green[500];
const accentGreen = green.A200;
const darkGreen = green[900];
const primaryPurple = purple[500];
const accentPurple = purple.A200;
const darkPurple = purple[900];

export const overridings = {
  name: 'Light Theme v2',
  palette: {
    primary: {
      light: accentGreen,
      main: primaryGreen,
      dark: darkGreen,
      contrastText: '#fff',
    },
    secondary: {
      light: accentPurple,
      main: primaryPurple,
      dark: darkPurple,
      contrastText: '#fff',
    },
  },
};

export default createTheme(overridings);
