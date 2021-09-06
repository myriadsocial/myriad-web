import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'inline-block',
      color: theme.palette.primary.main,
      fontWeight: 600,
<<<<<<< HEAD
=======
      marginLeft: theme.spacing(1),
>>>>>>> 2181b09b (MYR-717: init editor)
    },
  }),
);
