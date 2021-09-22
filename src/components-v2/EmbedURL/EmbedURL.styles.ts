import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 580,
      padding: theme.spacing(1, 1, 3),
      background: '#FFF',
    },
    input: {
      marginBottom: 196,
    },
  }),
);
