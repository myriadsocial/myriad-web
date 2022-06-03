import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(1.5),
    },
    content: {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    selected: {
      fontWeight: 600,
    },
    expand: {
      marginLeft: theme.spacing(1),
      padding: 0,
    },
    sort: {
      display: 'none',
      padding: '0px 8px',
      [theme.breakpoints.down('xs')]: {
        display: 'block',
        padding: 0,
      },
    },
  }),
);
