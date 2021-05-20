import { createStyles, Theme, makeStyles, fade } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper
    },
    inline: {
      display: 'inline'
    },
    notification: {
      backgroundColor: fade('#000', 0.3),
      borderRadius: 16,
      marginBottom: 16
    },
    notificationActive: {
      background: 'linear-gradient(180deg, rgba(160, 31, 171, 0.41) 0%, rgba(25, 26, 29, 0) 100%)',
      borderRadius: 16,
      marginBottom: 16,
      cursor: 'pointer'
    },
    notificationBadge: {
      top: 6
    }
  })
);
