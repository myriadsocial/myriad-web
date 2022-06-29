import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: 20,
      backgroundColor: '#FFC857',
      height: '100vh',
    },
    paper: {
      height: '100vh',
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
      backgroundColor: '#F6F7FC',
    },
    flex: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    background: {
      backgroundColor: '#FFC857',
      position: 'relative',
    },
    logo: {
      marginBottom: 24,
      height: 48,
    },
    title: {
      fontWeight: 700,
      lineHeight: '20px',
      marginBottom: 40,
      color: theme.palette.text.primary,
    },
    titlePrimary: {
      color: theme.palette.primary.main,
    },
    imagePurple: {
      position: 'absolute',
      top: '250px',
      left: '-55px',
    },
    imageYellow: {
      position: 'absolute',
      top: '100px',
      left: '165px',
    },
    carousel: {
      position: 'absolute',
      width: '450px',
      height: '100px',
      bottom: '100px',
      left: 40,
    },
    caption: {
      lineHeight: '35.14px',
      fontWeight: 700,
    },
    mb1: {
      marginBottom: theme.spacing(1),
    },
    subtitle: {
      fontWeight: 400,
      lineHeight: '26px',
    },
    border: {
      border: 0,
    },
  }),
);
