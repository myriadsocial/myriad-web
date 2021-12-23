import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: '#FFF',
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'start',
      textAlign: 'center',
      height: '335px',
    },
    title: {
      marginTop: 54,
      fontWeight: 700,
      marginBottom: 12,
    },
  }),
);
