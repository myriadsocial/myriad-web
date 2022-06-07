import {makeStyles, Theme} from '@material-ui/core';

export const useStyles = makeStyles<Theme>(theme => ({
  action: {
    '& > button:not(:last-child)': {
      [theme.breakpoints.down('md')]: {
        marginBottom: 8,
      },
    },
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
}));
