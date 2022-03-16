import {makeStyles, Theme} from '@material-ui/core';

export const useStyles = makeStyles<Theme>(theme => ({
  error: {
    backgroundColor: theme.palette.error.main,
  },
}));
