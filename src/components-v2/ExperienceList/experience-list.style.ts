import {createStyles, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'relative',
      '& .MuiListItem-gutters': {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    empty: {
      background: '#FFF',
      height: '491px',
      width: '100%',
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontWeight: 700,
      fontSize: '18px',
      marginBottom: '12px',
    },
    subtitle: {
      marginBottom: '40px',
      fontSize: '14px',
    },
  }),
);
