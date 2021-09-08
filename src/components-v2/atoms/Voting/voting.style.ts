import {createStyles, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'inline-block',
    },
    flex: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    flexColumn: {
      flexDirection: 'column',
    },
    action: {
      padding: 2,
      transform: 'rotate(-90deg)',
    },
    action2: {
      padding: 2,
      transform: 'rotate(90deg)',
    },
    text: {
      fontSize: '14px',
    },
  }),
);
