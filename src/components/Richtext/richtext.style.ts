import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      boxSizing: 'border-box',
      padding: '20px 30px',
      height: '90px',
      borderRadius: '10px',
      background: theme.palette.background.paper,
      [theme.breakpoints.down('xs')]: {
        padding: '10px',
        height: 'auto',
      },
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
      [theme.breakpoints.down('xs')]: {
        marginLeft: theme.spacing(2),
      },
    },
    action: {
      padding: 0,
      '& .MuiSvgIcon-root': {
        fill: 'none',
        fontSize: 30,
      },
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
    fill: {
      fill: 'none',
      fontSize: '35px',
    },
    box: {
      [theme.breakpoints.down('xs')]: {
        padding: '0px 20px',
      },
    },
    avatar: {
      height: '50px',
      width: '50px',
      [theme.breakpoints.down('xs')]: {
        height: '48px',
        width: '48px',
      },
    },
  }),
);
