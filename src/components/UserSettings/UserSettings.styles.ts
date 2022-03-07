import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: 27,
      padding: theme.spacing(2.5, 3.75, 3),
    },
    title: {
      fontWeight: 700,
      marginBottom: 12,
    },
    account: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    box: {
      background: theme.palette.background.paper,

      [theme.breakpoints.down('xs')]: {
        padding: '0px 20px',
      },
    },
  }),
);
