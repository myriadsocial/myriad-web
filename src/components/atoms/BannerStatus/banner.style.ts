import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      width: '100%',
      height: '48px',
      bottom: 0,
      left: 0,
      background: theme.palette.primary.main,
      zIndex: 9999,
    },
    icon: {
      position: 'absolute',
      right: '250px',
      cursor: 'pointer',
      [theme.breakpoints.down('xs')]: {
        position: 'absolute',
        right: '0px',
      },
    },
    fill: {
      marginRight: '12px',
      fill: 'currentColor',
    },
    text: {
      display: 'flex',
      color: '#FFF',
      alignItems: 'center',
      fontWeight: 600,
    },
  }),
);

export default useStyles;
