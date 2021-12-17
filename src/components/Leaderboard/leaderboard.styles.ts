import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: '22px 0px',
      display: 'flex',
      justifyContent: 'center',
    },
    container: {
      width: '674px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    divider: {
      height: '40px',
      width: '2px',
      backgroundColor: theme.palette.text.secondary,
      margin: '0px 10px',
    },
    content: {
      marginTop: theme.spacing(3),
      borderRadius: 20,
      padding: theme.spacing(2),
      backgroundColor: '#FFF',
    },
    tableHeader: {
      backgroundColor: '#F6F7FC',
      width: '100%',
      background: '#F6F7FC',
      borderRadius: '10px',
      padding: '10px',
    },
    text: {
      fontSize: '22px',
      fontWeight: 700,
    },
    p: {
      padding: '0px',
    },
    th: {
      fontSize: '16px',
      fontWeight: 600,
    },
    number: {
      fontWeight: 600,
    },
    secondary: {
      fontSize: '12px',
      color: theme.palette.text.secondary,
    },
    flexcenter: {
      height: '500px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
);
