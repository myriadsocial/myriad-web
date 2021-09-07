import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '555px',
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    write: {
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: theme.typography.fontFamily,
      border: 'none',
      borderRadius: theme.spacing(1),
      padding: theme.spacing(1.5),
      backgroundColor: theme.palette.background.paper,
      resize: 'none',
      '&:focus-visible': {
        outline: 'none',
      },
    },
    reply: {
      position: 'absolute',
      width: 85,
      height: 24,
      right: 0,
      bottom: 20,
    },
    action: {
      padding: 1,
    },
    replyIcon: {
      color: theme.palette.primary.main,
      transform: 'rotate(-45deg)',
    },
  }),
);
