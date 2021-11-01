import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1, 1, 3),
      background: '#FFF',
      width: 580,
    },
    confirm: {
      marginTop: 60,
      position: 'relative',
    },
    button: {
      '& .MuiButton-label': {
        zIndex: 2,
      },
    },
    progress: {
      backgroundColor: '#C2C2C2',
      position: 'absolute',
      top: 0,
      right: 0,
      height: 40,
      width: '100%',
      borderRadius: 20,
    },
  }),
);
