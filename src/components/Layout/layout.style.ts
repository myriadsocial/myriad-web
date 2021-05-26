import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxHeight: '100vh',
      overflow: 'auto'
    },
    experience: {
      width: 335,
      height: '100vh',
      marginRight: 30,
      overflowY: 'scroll',
      'scrollbar-color': '#A942E9 #171717 ',
      'scrollbar-width': 'thin !important'
    },
    user: {
      width: 320,
      marginRight: 0,
      height: '100vh',
      'overflow-y': 'scroll !important',
      'scrollbar-color': '#A942E9 #171717',
      'scrollbar-width': 'thin !important'
    },
    wallet: {
      width: 320
    },
    content: {
      marginRight: 0,
      height: '100vh'
    },
    fullheight: {
      height: '100vh'
    },
    grow: {
      flexGrow: 1
    },
    normal: {}
  })
);
