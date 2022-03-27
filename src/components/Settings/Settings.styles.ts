import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3.75, 0),
      minHeight: 'calc(100vh - 245px)',
      position: 'relative',
    },
    title: {
      fontSize: theme.typography.h4.fontSize,
      fontWeight: 700,
      paddingLeft: theme.spacing(3.75),
      paddingBottom: theme.spacing(5),
      [theme.breakpoints.down('xs')]: {
        paddingLeft: 20,
        paddingBottom: theme.spacing(3),
      },
    },
    subtitle: {
      fontSize: theme.typography.h4.fontSize,
      fontWeight: 700,
      paddingLeft: theme.spacing(3.75),
      paddingBottom: theme.spacing(1),
    },
    option: {
      paddingLeft: 30,
      paddingTop: 18,
      paddingBottom: 18,
      '&:hover ': {
        background: 'transparent',
      },
      '& .hidden-button': {
        display: 'none',
      },
      [theme.breakpoints.down('xs')]: {
        paddingLeft: 20,
        paddingBottom: theme.spacing(1),
        paddingTop: theme.spacing(1),
      },
    },
    primary: {
      [theme.breakpoints.down('xs')]: {
        fontSize: '14px',
        fontWeight: 400,
      },
    },
    secondary: {
      [theme.breakpoints.down('xs')]: {
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    action: {
      width: '100%',
      position: 'absolute',
      bottom: 0,
      left: 0,
      padding: '0px 30px',
    },
    mobile: {
      [theme.breakpoints.down('xs')]: {
        padding: '0px 20px',
      },
    },
  }),
);
