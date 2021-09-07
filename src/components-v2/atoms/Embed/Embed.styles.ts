import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    input: {
      marginBottom: 30,
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
    },
  }),
);
