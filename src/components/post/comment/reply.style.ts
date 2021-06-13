import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      padding: theme.spacing(0, 1),
      marginBottom: theme.spacing(1)
    },
    postAction: {
      marginTop: theme.spacing(1)
    },
    write: {
      width: '100%',
      fontFamily: theme.typography.fontFamily,
      borderColor: theme.palette.primary.main,
      padding: theme.spacing(1.5),
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.spacing(1),
      resize: 'none',
      '&:focus-visible': {
        outline: 'none'
      }
    },
    reply: {
      position: 'absolute',
      width: 48,
      height: 48,
      right: 0,
      bottom: 8
    },
    replyIcon: {
      color: theme.palette.primary.main,
      transform: 'rotate(-30deg)'
    }
  })
);
