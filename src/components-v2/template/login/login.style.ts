import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: '20px',
      backgroundColor: '#FFC857',
      minHeight: '100vh',
    },
    paper: {
      minHeight: '100vh',
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.background.paper,
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
      // background: 'url(../../../images/background.svg)',
      // backgroundRepeat: 'no-repeat',
      // backgroundSize: '100% 100%',
    },
    logo: {
      marginTop: '100px',
    },
    title: {
      fontSize: 16,
      fontWeight: 700,
      lineHeight: '20px',
      marginBottom: theme.spacing(10),
      color: theme.palette.text.primary,
    },
    titlePrimary: {
      color: theme.palette.primary.main,
    },
    button: {
      marginBottom: theme.spacing(4),
    },
    span: {
      marginBottom: theme.spacing(25),
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.primary.main,
    },
  }),
);
