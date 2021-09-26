import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    selected: {
      marginLeft: theme.spacing(1),
      fontWeight: 600,
    },
    expand: {
      marginLeft: theme.spacing(1),
      padding: 0,
    },
  }),
);
