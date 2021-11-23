import {createStyles, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles(() =>
  createStyles({
    mb: {
      marginBottom: '10px',
    },
    emptyUser: {
      textAlign: 'center',
      background: '#FFF',
      borderRadius: 20,
      height: '643px',
      padding: 30,
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
