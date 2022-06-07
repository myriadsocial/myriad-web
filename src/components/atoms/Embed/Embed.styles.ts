import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
    },
    input: {
      marginBottom: 30,
    },
    embed: {
      margin: '0 auto',
      width: 560,

      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    reddit: {
      width: 560,
      height: 460,
      border: 'none',
      [theme.breakpoints.down('xs')]: {
        width: 310,
        height: 460,
      },
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
    },
  }),
);
