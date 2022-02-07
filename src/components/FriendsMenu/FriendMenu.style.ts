import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 644,
      borderRadius: 20,
      padding: 0,

      [theme.breakpoints.down('md')]: {
        minWidth: 590,
      },
    },
    title: {
      padding: 24,
      fontSize: '18px',
      fontWeight: 700,
      lineHeight: '23px',
      letterSpacing: '0em',
    },
  }),
);
