import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(2.5),
      paddingBottom: theme.spacing(2.5),
    },
    title: {
      fontWeight: 700,
    },
  }),
);
