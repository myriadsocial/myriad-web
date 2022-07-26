import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.down('xs')]: {
        padding: '0px 20px',
      },
    },
    mb: {
      marginBottom: 10,
    },
    container: {
      textAlign: 'center',
      background: '#FFF',
      borderRadius: 20,
      height: undefined,
      padding: 20,

      [theme.breakpoints.down('md')]: {
        minWidth: 590,
      },

      [theme.breakpoints.down('xs')]: {
        minWidth: 0,
        borderRadius: 10,
      },
    },
    iframe: {
      width: '100%',
      height: 400,
      borderRadius: 20,
    },
    iframeFull: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 10,
    },
    containerFooter: {
      display: 'flex',
    },
    btnVisit: {
      marginRight: theme.spacing(1),
      padding: 0,
      color: theme.palette.primary.main,
    },
    mr1: {
      marginRight: theme.spacing(0.5),
    },
    mr5: {
      marginRight: theme.spacing(2),
    },
    fill: {
      fill: 'none',
      width: 18,
      height: 18,
      color: theme.palette.primary.main,

      [theme.breakpoints.down('xs')]: {
        color: theme.palette.primary.main,
      },
    },
  }),
);
