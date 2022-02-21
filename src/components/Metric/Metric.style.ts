import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 240,
    },
    username: {
      fontWeight: 700,
      lineHeight: '17.57px',
      [theme.breakpoints.down('xs')]: {
        fontWeight: theme.typography.fontWeightRegular,
        color: '#616161',
        fontSize: 12,
      },
    },
    total: {
      fontWeight: 700,
      lineHeight: '20.08px',

      [theme.breakpoints.down('xs')]: {
        fontWeight: theme.typography.fontWeightMedium,
        fontSize: 16,
      },
    },
    post: {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
  }),
);
