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
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: 'rotate(180deg)'
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
    comment: {
      marginBottom: theme.spacing(1)
    },
    avatar: {
      backgroundColor: '#E849BD'
    },
    action: {
      marginTop: 16
    }
  })
);
