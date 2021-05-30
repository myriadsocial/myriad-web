import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxHeight: '100vh',
      overflow: 'auto'
    },
    appWrapper: {
      display: 'flex',
      margin: '0 32px  0 32px'
    },
    contentWrapper: {
      display: 'flex',
      flex: '1 1 auto',
      marginTop: 32
    },
    user: {
      flex: '0 0 327px',
      marginRight: 0,
      // height: '100vh',
      // 'overflow-y': 'scroll !important',
      'scrollbar-color': '#A942E9 #171717',
      'scrollbar-width': 'thin !important'
    },
    content: {
      // flex: '1 1 auto',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: '0 24px 0 24px',
      height: '100vh',
      maxWidth: 726,
      [theme.breakpoints.up('xl')]: {
        maxWidth: 926
      }
    },
    experience: {
      flex: '0 0 331px',
      // height: '100vh',
      // overflowY: 'scroll',
      'scrollbar-color': '#A942E9 #171717 ',
      'scrollbar-width': 'thin !important'
    },
    wallet: {
      width: 327
    },

    fullheight: {
      height: '100vh'
    },

    profile: {
      flexGrow: 1
    }
  })
);
