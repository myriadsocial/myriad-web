import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100vh',
      overflow: 'hidden',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      scrollbarColor: 'transparent transparent',
      '& ::-webkit-scrollbar': {
        display: 'none',
        width: '0 !important'
      }
    },
    scroll: {
      height: '100%',
      width: '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    child: {
      '& > *': {
        margin: theme.spacing(1)
      }
    },
    loading: {
      position: 'absolute',
      top: 100,
      left: 'calc(50% - 20px)'
    },
    headerPicture: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#424242',
      borderBottom: `1px solid`,
      borderBottomColor: 'black'
    },
    avatar: {
      marginRight: 10,
      width: '100px',
      height: '100px',
      borderRadius: '50px',
      backgroundColor: 'salmon',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 50
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
      backgroundColor: 'white',
      padding: 20
    },
    logo: {
      width: 30,
      height: 30,
      backgroundColor: 'purple',
      borderRadius: 10,
      marginRight: 10
    }
  })
);
