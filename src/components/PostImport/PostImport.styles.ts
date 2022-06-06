import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 840,

      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    input: {
      marginBottom: 30,
    },
    title: {
      marginBottom: 20,
    },
    preview: {
      border: '1px solid',
      borderColor: '#E5E5E5',
      borderRadius: 5,
      background: '#FFF',
      padding: 30,

      [theme.breakpoints.down('xs')]: {
        padding: 10,
      },
    },
  }),
);
