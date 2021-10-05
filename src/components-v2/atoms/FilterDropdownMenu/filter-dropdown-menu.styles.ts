import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      marginBottom: theme.spacing(2.5),
      marginTop: theme.spacing(2.5),
      marginLeft: 16,
    },
    selected: {
      fontWeight: 600,
    },
    expand: {
      marginLeft: theme.spacing(1),
      padding: 0,
    },
  }),
);
