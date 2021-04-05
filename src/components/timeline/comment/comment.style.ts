import { makeStyles, Theme, createStyles, fade } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
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
    reply: {
      backgroundColor: fade(theme.palette.primary.main, 0.5)
    },
    comment: {
      backgroundColor: '#171717',
      borderRadius: 8
    },
    action: {
      marginTop: 16
    }
  })
);
