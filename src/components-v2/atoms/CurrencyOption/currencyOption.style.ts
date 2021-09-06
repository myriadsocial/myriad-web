import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '200px',
      borderRadius: '10px',
    },
    header: {
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      padding: '6px 16px',
    },
    tokenColumn: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    flex: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
    },
    avatar: {
      width: theme.spacing(1.5),
      height: theme.spacing(1.5),
      marginRight: theme.spacing(1),
    },
    text: {
      fontWeight: 400,
      fontSize: '12px',
    },
    input: {
      width: '160px',
      height: '32px',
      border: 'solid grey 1px',
      borderRadius: '20px',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  }),
);
