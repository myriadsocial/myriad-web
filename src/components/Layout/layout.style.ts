import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxHeight: '100vh',
      overflow: 'auto'
    },
    experience: {
      width: 296,
      height: '100vh',
      overflowY: 'scroll',
      'scrollbar-color': '#A942E9 #171717 ',
      'scrollbar-width': 'thin !important'
    },
    user: {
      width: 360,
      marginRight: 0,
      height: '100vh',
      overflowY: 'scroll',
      'scrollbar-color': '#A942E9 #171717',
      'scrollbar-width': 'thin !important'
    },
    content: {
      flexGrow: 1
    },
    fullheight: {
      height: '100%'
    },
    grow: {
      flexGrow: 1
    },
    normal: {}
  })
);
