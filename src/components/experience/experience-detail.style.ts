import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    details: {
      display: 'flex',
      flexDirection: 'column'
    },
    content: {
      flex: '1 0 auto'
    },
    cover: {
      width: 151
    },
    layout: {
      display: 'flex',
      justifyContent: 'space-around'
    },
    check: {
      margin: 0
    },
    avatar: {
      '& > *': {
        margin: theme.spacing(1)
      },
      marginBottom: theme.spacing(2)
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      '& >*': {
        marginBottom: theme.spacing(1.5)
      }
    },
    active: {
      backgroundColor: '#E849BD'
    },
    inline: {
      display: 'inline-flex'
    }
  })
);
