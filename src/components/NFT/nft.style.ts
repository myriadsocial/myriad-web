import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mb: {
      marginBottom: 10,
    },
    emptyUser: {
      textAlign: 'center',
      background: '#FFF',
      borderRadius: 20,
      height: 644,
      padding: 30,

      [theme.breakpoints.down(1346)]: {
        minWidth: 600,
      },
    },
    text: {
      marginBottom: '20px',
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: 1,
    },
    text2: {
      marginBottom: '85px',
      fontSize: '20px',
      lineHeight: 1,
    },
    illustration: {
      marginBottom: '80px',
      marginTop: '70px',
    },
  }),
);
