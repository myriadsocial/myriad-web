import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {width: '460px', marginTop: '8px'},
    flex: {display: 'flex', justifyContent: 'space-between'},
    color: {
      color: theme.palette.primary.main,
      fontWeight: 600,
      fontSize: '16px',
    },
    text: {
      fontSize: '16px',
      marginBottom: '8px',
      fontWeight: 600,
    },
    secondaryText: {
      fontSize: '12px',
      color: theme.palette.text.secondary,
      marginBottom: '40px',
    },
    box: {
      position: 'relative',
    },
    count: {
      fontSize: '12px',
      color: theme.palette.text.secondary,
      position: 'absolute',
      right: '10px',
      bottom: '40px',
    },
  }),
);
