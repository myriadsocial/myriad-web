import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: '#FFF',
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      marginTop: 54,
      fontWeight: 700,
      fontSize: '18px',
      marginBottom: '12px',
    },
    subtitle: {
      marginBottom: 250,
      fontSize: '14px',
    },
  }),
);
