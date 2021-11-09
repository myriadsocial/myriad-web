import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    alert: {
      display: 'flex',
      marginTop: '-20px',
      padding: '12px 24px',
      alignItems: 'center',
      backgroundColor: '#FFD7D7',
      justifyContent: 'space-between',
      borderRadius: '0px 0px 10px 10px',
    },
    fill: {
      marginRight: '12px',
      fill: 'currentColor',
    },
    text: {
      display: 'flex',
      color: '#404040',
      fontSize: '12px',
      alignItems: 'center',
    },
    hidden: {
      color: 'red',
      fontSize: 12,
      fontWeight: 700,
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  }),
);

export default useStyles;
