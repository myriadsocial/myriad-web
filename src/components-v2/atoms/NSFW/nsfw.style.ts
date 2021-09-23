import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#757575',
      boxSizing: 'border-box',
      borderRadius: '5px',
      textAlign: 'center',
      height: '315px',
      color: '#FFF',
      padding: '20px',
    },
    title: {
      fontSize: '18px',
      marginBottom: '8px',
      fontWeight: 400,
    },
    subTitle: {
      fontSize: '14px',
      marginBottom: '20px',
      fontWeight: 400,
    },
    fill: {
      fill: 'none',
    },
    icon: {
      fontSize: '72px',
      color: '#FFF',
      marginTop: '30px',
      marginBottom: '8px',
    },
  }),
);
