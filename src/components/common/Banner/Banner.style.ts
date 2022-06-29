import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      width: '100%',
      bottom: 0,
      left: 0,
      background: theme.palette.primary.main,
      zIndex: 9999,
      color: '#FFFFFF',
    },
    padding: {
      paddingLeft: 312,
      paddingRight: 312,
      paddingTop: 10,
      paddingBottom: 10,

      [theme.breakpoints.down('md')]: {
        paddingLeft: 290,
        paddingRight: 290,
      },

      [theme.breakpoints.down('xs')]: {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    icon: {
      marginRight: 12,
      fill: 'currentColor',
    },
    right: {
      marginLeft: 20,
      cursor: 'pointer',
      [theme.breakpoints.down('xs')]: {
        position: 'absolute',
        right: 0,
      },
    },
  }),
);

export default useStyles;
