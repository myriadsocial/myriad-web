import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.down('xs')]: {
        position: 'relative',
      },
    },
    box: {
      display: 'none',
      [theme.breakpoints.down('xs')]: {
        display: 'block',
        height: '20px',
      },
    },
    dropdownMenu: {
      marginBottom: theme.spacing(1.5),
    },
    sort: {
      [theme.breakpoints.down('xs')]: {
        position: 'absolute',
        top: '-57px',
      },
    },
  }),
);
