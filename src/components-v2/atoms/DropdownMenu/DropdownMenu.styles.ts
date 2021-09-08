import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    expand: {
      marginLeft: theme.spacing(1),
      padding: 0,
    },
  }),
);
