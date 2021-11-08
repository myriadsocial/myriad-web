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
      height: '260px',
      position: 'relative',
      width: '100%',
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px',
      color: '#FFFFFF',
    },
    avatar: {
      boxSizing: 'border-box',
      border: '2px solid #E5E5E5',
      width: theme.spacing(10),
      height: theme.spacing(10),
      marginRight: '20px',
      fontSize: '30px',
    },
    name: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: '30px',
      letterSpacing: '0em',
      marginBottom: '4px',
    },
    username: {
      fontSize: '14px',
      fontWeight: 700,
      lineHeight: '17.57px',
    },
    adition: {
      fontSize: '12px',
      fontWeight: 700,
      lineHeight: '15.06px',
    },
    aditionLite: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '15.06px',
    },
    total: {
      fontSize: '16px',
      fontWeight: 700,
      lineHeight: '20.08px',
    },
    solid: {
      fill: 'currentColor',
    },
    action: {
      background: 'rgba(115, 66, 204, 0.2)',
      padding: '8px',
    },
    flex: {
      display: 'flex',
      alignItems: 'flex-start ',
      justifyContent: 'space-between',
    },
    flexEnd: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    flexCenter: {
      display: 'flex',
      alignItems: 'center',
    },
    mt22: {
      marginTop: '22px',
    },
    mt15: {
      marginTop: '15px',
    },
    mr12: {
      marginRight: '12px',
    },
    button: {
      width: 'auto',
      minWidth: '120px',
    },
    icon: {
      marginRight: theme.spacing(1),
      fontSize: '20px',
    },
    ml20: {
      marginLeft: '20px',
    },
    fill: {
      fill: 'none',
    },
    text: {
      display: 'inline-block',
      marginRight: '20px',
    },
    menu: {
      borderRadius: '10px',
      marginTop: '8px',
    },
    delete: {
      color: '#FE3636',
    },
    'flex-center': {
      display: 'flex',
      justifyContent: 'center',
    },
    m1: {
      marginRight: theme.spacing(2),
    },
    error: {
      background: '#FE3636',
      color: '#FFF',
      '&:hover': {
        color: theme.palette.text.primary,
      },
    },
    link: {
      color: '#FFF',
    },
  }),
);
