import { makeStyles, Theme, createStyles, lighten } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: 14
    },
    media: {
      height: 0,
      paddingTop: '56.25%' // 16:9
    },

    content: {
      '& > *': {
        marginBottom: theme.spacing(1)
      }
    },
    reply: {
      backgroundColor: lighten(theme.palette.primary.main, 0.15),
      position: 'relative'
    },
    avatar: {
      backgroundColor: '#E849BD'
    },
    action: {
      marginTop: 16
    }
  })
);
