import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    media: {
      height: 180,
      objectFit: 'cover'
      // paddingTop: '34.25%',
    },
    button: {
      width: 100,
      margin: 0,
      marginLeft: -20,
      borderRadius: 5
    },
    header: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingRight: 20,
      paddingLeft: 20,
      paddingBottom: 10,
      position: 'absolute',
      top: 80
    },
    avatar: {
      width: '100px',
      height: '100px',
      border: '3px solid',
      borderColor: 'white',
      borderRadius: '9999px',
      backgroundColor: '#424242',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 30,
      color: 'white',
      marginRight: 10,
      position: 'absolute',
      top: 50
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
      fontSize: 16,
      lineHeight: '12px',
      fontWeight: 500,
      color: '#FFF',
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
    actions: {
      justifyContent: 'space-between'
    },
    avatarBig: {
      height: 90,
      width: 90,
      position: 'absolute',
      top: 140
    },
    detail: {
      position: 'relative'
    },
    logout: {
      textAlign: 'center'
    },
    profileContent: {
      width: 500,
      marginTop: 40
    }
  })
);
