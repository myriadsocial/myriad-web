import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxHeight: '100vh',
      overflow: 'auto'
    },
    appWrapper: {
      display: 'flex',
      margin: '0 32px  0 32px',
      maxHeight: '100vh'
    },
    contentWrapper: {
      display: 'flex',
      flex: '1 1 auto',
      marginTop: 32
    },
    experience: {
      filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.16))',
      flex: '0 0 331px',
      'scrollbar-color': '#A942E9 #171717 ',
      'scrollbar-width': 'thin !important'
    }
  })
);
