import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: 'transparent',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3),
      position: 'relative'
      // flexGrow: 1,
    },
    button: {
      height: 24,
      lineHeight: 10,
      textAlign: 'center',
      border: 1,
      borderRadius: 8
    },
    gutters: {
      border: `1px solid`,
      borderColor: '#A942E9',
      borderRadius: 8,
      paddingTop: 0,
      paddingBottom: 0,
      marginBottom: theme.spacing(1)
    },
    icon: {
      minWidth: 40
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
    login: {
      position: 'absolute',
      top: 0,
      left: 0
    }
  })
);
