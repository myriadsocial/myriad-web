import {makeStyles, Theme} from '@material-ui/core';

export const useStyles = makeStyles<Theme>(theme => ({
  action: {
    '& > button': {
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    '& > button:not(:last-child)': {
      [theme.breakpoints.down('xs')]: {
        marginBottom: 8,
      },
    },
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
}));
