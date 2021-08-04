import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: 'auto',
      position: 'relative',
    },
    appWrapper: {
      display: 'flex',
      margin: theme.spacing(0, 4),
      marginRight: 363,
    },
    contentWrapper: {
      display: 'flex',
      flex: '1 1 auto',
      marginTop: 32,
    },
    sidebarWrapper: {
      position: 'fixed',
      right: 32,
      top: 124,
      // minHeight: '100vh',
      // flex: '0 0 331px',
      filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.16))',
      'scrollbar-color': '#A942E9 #171717 ',
      'scrollbar-width': 'thin !important',
    },
  }),
);
