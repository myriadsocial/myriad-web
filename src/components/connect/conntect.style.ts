import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      backgroundColor: '#A942E9'
    },
    account: {
      height: 36,
      '& .MuiInputBase-inputHiddenLabel': {
        height: 36
      },
      '& MuiInputAdornment-positionStart': {
        marginLeft: theme.spacing(1)
      }
    },
    message: {
      backgroundColor: theme.palette.primary.main,
      borderRadius: 8
    },
    share: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    facebook: {
      color: '#3b5998',
      minWidth: 40
    },
    twitter: {
      color: '#1DA1F2',
      minWidth: 40
    },
    reddit: {
      color: '#FF5700',
      minWidth: 40
    },
    linkAction: {
      marginTop: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center'
    },
    done: {
      flexDirection: 'column'
    }
  })
);
