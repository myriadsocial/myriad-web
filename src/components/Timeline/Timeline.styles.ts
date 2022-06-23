import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: 0,

      '& > *': {
        marginBottom: theme.spacing(1.5),
      },
    },
    box: {
      [theme.breakpoints.down('xs')]: {
        padding: '0px 20px',
      },
    },
    wrapperLoadPost: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '30px',
      marginBottom: '22px',
    },
    badge: {
      minWidth: '28px',
      height: '28px',
      padding: '4px 8px 4px 8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '20px',
      backgroundColor: theme.palette.primary.main,
      marginLeft: '4px',
    },
    badgeText: {
      color: theme.palette.common.white,
      fontSize: '14px',
    },
    btnScrollTop: {
      position: 'sticky',
      width: '138px',
      zIndex: 9999,
      top: 36,
      left: 'calc(50% - 69px)',
    },
  }),
);
