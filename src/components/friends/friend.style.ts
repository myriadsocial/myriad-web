import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
      minHeight: 'calc(100vh - 124px)',
      display: 'flex',
      flexFlow: 'column',
    },
    header: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
    },
    title: {
      marginBottom: theme.spacing(1),
    },
  }),
);
