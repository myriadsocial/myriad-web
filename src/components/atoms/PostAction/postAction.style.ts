import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 424,
      paddingRight: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      '& > div': {
        marginRight: 20,
      },

      [theme.breakpoints.between('sm', 'md')]: {
        width: 380,
      },

      [theme.breakpoints.down('xs')]: {
        width: 224,
        paddingRight: 30,
      },
    },
    section: {
      display: 'inline-block',
    },
    action: {
      marginRight: theme.spacing(1),
      padding: 0,
      color: theme.palette.primary.main,
    },
    mr1: {
      marginRight: theme.spacing(0.5),
    },
    fill: {
      fill: 'none',
      width: 18,
      height: 18,
      color: '#404040',

      [theme.breakpoints.down('xs')]: {
        color: theme.palette.primary.main,
      },
    },
    modal: {
      paddingBottom: 10,
    },
    copy: {
      width: 520,
      [theme.breakpoints.down('xs')]: {
        width: 'auto',
      },
    },
    subtitle: {
      fontWeight: 500,
      marginBottom: 26,
      lineHeight: 1,
    },
    input: {
      marginBottom: '0px',
      '& .MuiOutlinedInput-input': {
        padding: '12px 16px',
      },
    },
    multiline: {
      marginBottom: '0px',
      '& .MuiOutlinedInput-multiline': {
        padding: '12px 16px',
      },
    },
    copyButton: {
      width: '100%',
      textAlign: 'right',
      marginTop: 16,
    },
    divider: {
      height: 1,
      width: '100%',
      background: '#E0E0E0',
      marginTop: 32,
      marginBottom: 32,
    },
    wording: {
      fontSize: 14,
      fontWeight: 600,

      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
  }),
);
