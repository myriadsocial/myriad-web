import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

//TODO: split this fx into sub-components
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    input: {
      '&::before,&::after': {
        content: '""',
        position: 'absolute',
        height: 24,
        width: 85,

        backgroundColor: '#FFD24D',
      },
      '&::before': {
        left: -85,
      },
      '&::after': {
        right: -85,
      },

      // disable arrow
      '& input[type=number]': {
        '-moz-appearance': 'textfield',
      },
      '& input[type=number]::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
      },
      '& input[type=number]::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
      },
    },
  }),
);
