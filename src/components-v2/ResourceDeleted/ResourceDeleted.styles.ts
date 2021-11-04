import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: '#FFF',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 100px)',
      padding: theme.spacing(0, 6),
    },
    illustration: {
      marginTop: 90,
      marginBottom: 60,
      height: 200,
      width: 265,
    },
    title: {
      lineHeight: '28px',
      marginBottom: 20,
      fontWeight: 700,
      fontSize: 24,
    },
    subtitle: {
      lineHeight: '32px',
      marginBottom: 50,
      fontSize: 20,
      textAlign: 'center',
    },
    button: {
      marginBottom: 100,
    },
  }),
);
