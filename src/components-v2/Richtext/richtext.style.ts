import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      boxSizing: 'border-box',
      padding: '20px 30px',
      width: '643px',
      height: '90px',
      borderRadius: '10px',
      background: theme.palette.background.paper,
    },
    flex: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    postTextArea: {
      background: theme.palette.background.paper,
      fontFamily: theme.typography.fontFamily,
      padding: theme.spacing(1),
      lineHeight: '17.57px',
      marginLeft: '10px',
      resize: 'none',
      width: '100%',
      fontSize: 14,
      height: 48,
      border: 0,
      '&:focus-visible': {
        outline: 'none',
      },
    },
    action: {
      padding: 0,
    },
    screen: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      borderRadius: 8,
      cursor: 'pointer',
    },
  }),
);
