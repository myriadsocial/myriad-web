import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 678,
      height: 445,
      background:
        'linear-gradient(117.69deg, rgba(112, 112, 112, 0.2) 60.66%, rgba(203, 203, 203, 0) 114.57%)',
      backdropFilter: 'blur(24px)',
      /* Note: backdrop-filter has minimal browser support */
      borderColor: ' #696969',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '27px 22px 30px',
      marginBottom: 42,
      position: 'relative',
    },
    header: {},
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
      color: theme.palette.text.secondary,
    },
    back: {
      background: 'rgba(173, 172, 172, 0.5)',
      color: theme.palette.text.secondary,
      position: 'absolute',
      height: 40,
      width: 40,
      left: 50,
      top: 24,
    },
    form: {
      width: 444,
      marginBottom: theme.spacing(5),
    },
    username: {
      marginBottom: theme.spacing(1),
    },
    captcha: {
      margin: theme.spacing(5, 0),
    },
    signIn: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      padding: theme.spacing(1),
      fontSize: 16,
      fontWeight: 600,
    },
    confirm: {
      width: 444,
      display: 'flex',
      flexWrap: 'wrap',

      '& .MuiFormHelperText-root': {
        color: 'rgb(255, 140, 0)',
        marginTop: 4,
        fontSize: 14,
        fontWeight: 600,
        marginLeft: 0,
      },
    },
    copy: {
      marginLeft: 'auto',
      marginRight: 'auto',
      color: theme.palette.text.secondary,
      marginTop: 56,
      marginBottom: 56,

      '& .MuiFormControlLabel-label': {
        fontSize: 14,
        fontWeight: 600,
        color: theme.palette.text.secondary,
      },
    },
  }),
);
