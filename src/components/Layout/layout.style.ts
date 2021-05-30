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
    experience: {
      flex: '0 0 331px',
      'scrollbar-color': '#A942E9 #171717 ',
      'scrollbar-width': 'thin !important'
    },
  })
);
