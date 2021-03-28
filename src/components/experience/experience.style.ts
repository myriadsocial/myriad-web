import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(2)
    },
    item: {
      '&.Mui-selected': {
        backgroundImage: 'linear-gradient(to right, #E849BD, lightpink)',
        color: '#171717'
      }
    },
    action: {
      textAlign: 'center'
    },
    more: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    show: {
      color: '#E849BD'
    },
    normal: {},
    expand: {
      transform: 'rotate(180deg)'
    }
  })
);
