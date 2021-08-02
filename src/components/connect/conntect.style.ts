import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 724,
    },
    icon: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      minWidth: theme.spacing(4),
      fontSize: 16,
    },
    account: {
      height: 36,
      '& .MuiInputBase-inputHiddenLabel': {
        height: 36,
      },
      '& .MuiInputAdornment-positionStart': {
        marginLeft: theme.spacing(2),
      },
    },
    message: {
      backgroundColor: theme.palette.primary.main,
      borderRadius: 8,
      '& .MuiOutlinedInput-notchedOutline': {
        border: 0,
      },
    },
    share: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    facebook: {
      color: '#3b5998',
      minWidth: 40,
    },
    twitter: {
      color: '#1DA1F2',
      minWidth: 40,
    },
    reddit: {
      color: '#FF5700',
      minWidth: 40,
    },
    linkAction: {
      marginTop: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      marginRight: 32,
    },

    term: {
      fontSize: 16,
      marginBottom: theme.spacing(3),
    },
    done: {
      flexDirection: 'column',
    },
    buttonProgress: {
      color: theme.palette.primary.main,
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }),
);
