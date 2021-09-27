import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 auto',
      marginTop: theme.spacing(1),
      background: 'transparent',
    },
    content: {
      padding: theme.spacing(0, 2),
      background: theme.palette.background.paper,
    },
  }),
);
