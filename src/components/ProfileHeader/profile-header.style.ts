import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    media: {
      height: '100%',
      width: '100%',
      objectFit: 'cover',
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: -999,
      [theme.breakpoints.down('xs')]: {
        borderRadius: 0,
      },
    },
    screen: {
      zIndex: -99,
      height: '100%',
      width: '100%',
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px',
      top: 0,
      left: 0,
      position: 'absolute',
      background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%)',
    },
    root: {
      zIndex: 0,
      boxSizing: 'border-box',
      padding: '30px',
      paddingBottom: '20px',
      minHeight: '260px',
      position: 'relative',
      width: '100%',
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px',
      color: '#FFFFFF',
      [theme.breakpoints.down('xs')]: {
        padding: '20px',
        minHeight: '229px',
      },
    },
    avatar: {
      boxSizing: 'border-box',
      border: '2px solid #E5E5E5',
      width: theme.spacing(10),
      height: theme.spacing(10),
      marginRight: '20px',
      fontSize: '30px',
      [theme.breakpoints.down('xs')]: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
    },
    name: {
      fontSize: '24px',
      fontWeight: 700,
      letterSpacing: '0em',
      marginBottom: '4px',
      [theme.breakpoints.down('xs')]: {
        fontWeight: 500,
        fontSize: '14px',
        marginBottom: 0,
      },
    },
    username: {
      fontSize: '14px',
      fontWeight: 300,
      [theme.breakpoints.down('xs')]: {
        fontSize: '12px',
      },
    },
    bio: {
      wordBreak: 'break-all',
      marginTop: '20px',
      [theme.breakpoints.down('xs')]: {
        fontSize: '14px',
        marginTop: '0px',
      },
    },
    detail: {
      flexDirection: 'row',
      marginTop: 15,
      gap: 8,

      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    metric: {
      width: 225,
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    actionItem: {
      width: 270,
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    solid: {
      fill: 'currentColor',
    },
    userMenu: {
      background: 'rgba(115, 66, 204, 0.2)',
      padding: '8px',
    },
    mt15: {
      marginTop: '15px',
    },
    editBtn: {
      width: 'auto',
      minWidth: 120,
      marginLeft: 'auto',
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    button: {
      width: 'auto',
      minWidth: 120,
      [theme.breakpoints.up('xs')]: {
        maxWidth: 150,
      },
      [theme.breakpoints.down('xs')]: {
        width: 152,
      },
    },
    fill: {
      fill: 'none',
    },
    menu: {
      borderRadius: '10px',
      marginTop: '8px',
    },
    delete: {
      color: '#FE3636',
    },
    m1: {
      marginRight: theme.spacing(1.5),
    },
    error: {
      background: '#FE3636',
      color: '#FFF',
      '&:hover': {
        color: theme.palette.text.primary,
      },
    },
    'flex-center': {
      display: 'flex',
      justifyContent: 'center',
    },
  }),
);
