import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: theme.palette.background.paper,
      marginBottom: theme.spacing(5),
      position: 'relative',
      borderRadius: '8px'
    },
    button: {
      paddingRight: 24,
      paddingLeft: 24,
      paddingTop: 8,
      paddingBottom: 8,
      borderRadius: '8px'
    },
    button2: {
      paddingRight: 40,
      paddingLeft: 40,
      paddingTop: 8,
      paddingBottom: 8,
      borderRadius: '8px'
    },
    header: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      // alignItems: 'center',
      // backgroundColor: theme.palette.background.paper,
      padding: 16,
      height: '339px',
      color: '#4B4851'
    },
    avatar: {
      width: '72px',
      height: '72px',
      borderRadius: '9999px',
      backgroundColor: '#424242',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 30,
      color: 'white',
      marginRight: 10
    },
    about: {
      textAlign: 'center',
      padding: 20,
      backgroundColor: '#424242',
      borderBottom: `1px solid`,
      borderBottomColor: 'black'
    },
    socialMediaList: {
      display: 'flex',
      justifyContent: 'flex-start',
      backgroundColor: '#424242',
      padding: 20,
      borderBottomRightRadius: '4px',
      borderBottomLeftRadius: '4px'
    },
    logo: {
      width: 30,
      height: 30,
      backgroundColor: 'white',
      borderRadius: 10,
      marginRight: 10
    },
    name: {
      fontSize: 18,
      lineHeight: '12px',
      fontWeight: 500,
      textTransform: 'capitalize'
    },
    publicKey: {
      fontSize: 14,
      lineHeight: '12px',
      fontWeight: 400,
      color: '#FFF',
      textTransform: 'capitalize'
    },
    // modal
    media: {
      height: 159,
      width: 420,
      objectFit: 'cover',
      borderRadius: 8
    },
    actions: {
      justifyContent: 'space-between'
    },
    avatarBig: {
      height: 72,
      width: 72,
      position: 'absolute',
      top: 46,
      left: 16
    },
    detail: {
      position: 'relative'
    },
    logout: {
      textAlign: 'center'
    },
    profileContent: {
      width: 420
    },
    subtitle: {
      fontWeight: 700,
      fontSize: 16,
      color: '#4B4851'
    }
  })
);
