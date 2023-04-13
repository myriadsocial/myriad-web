import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: 0,

      '& > *': {
        marginBottom: theme.spacing(1.5),
      },
    },
    button: {
      position: 'fixed',
      right: '50px',
      bottom: '50px',
      cursor: 'pointer',
      zIndex: 99,
    },
    iconbutton: {
      backgroundColor: '#862AE9',
      width: '52px',
      height: '52px',
      '&:hover': {
        backgroundColor: '#862AE9',
        opacity: 0.8,
      },
    },
    fill: {
      color: '#fff',
      fontSize: '24px',
    },
  }),
);
