import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    share: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    card: {
      boxShadow: 'none'
    },
    purple: {
      backgroundColor: '#A942E9'
    },
    dark: {
      backgroundColor: theme.palette.primary.main,
      borderRadius: 8
    },
    info: {
      textTransform: 'none'
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
    done: {
      flexDirection: 'column'
    },
    doneText: {
      align: 'justify',
      color: 'red'
    },
    usernameForm: {
      width: 400
    }
  })
);
