import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 580,
      padding: theme.spacing(1, 1, 3),
      background: '#FFF',

      [theme.breakpoints.down('xs')]: {
        width: 288,
      },
    },
    input: {
      marginBottom: 30,
      paddingTop: 0,
    },
    confirm: {
      marginTop: 15,
    },
  }),
);
