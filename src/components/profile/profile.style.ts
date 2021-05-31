import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100vh',
      width: '78vw',
      overflow: 'hidden',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      scrollbarColor: 'transparent transparent',
      '& ::-webkit-scrollbar': {
        display: 'none',
        width: '0 !important'
      }
    },
    scroll: {
      height: '100%',
      width: '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    child: {
      '& > *': {
        // margin: theme.spacing(1)
        marginTop: theme.spacing(1)
      }
    },
    loading: {
      position: 'absolute',
      top: 100,
      left: 'calc(50% - 20px)'
    }
  })
);
