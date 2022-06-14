import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1, 1, 3),
      background: '#FFF',
      width: 720,
      [theme.breakpoints.down('xs')]: {
        width: 256,
      },
    },
    confirm: {
      marginTop: 16,
      position: 'relative',
    },
    button: {
      '& .MuiButton-label': {
        zIndex: 2,
      },
    },
    progress: {
      backgroundColor: '#C2C2C2',
      width: '100%',
      height: 10,
      marginBottom: 30,
      borderRadius: 20,
    },
  }),
);
