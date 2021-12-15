import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',

      '& > div': {
        marginRight: theme.spacing(2),
      },
    },
    section: {
      display: 'inline-block',
      marginLeft: '5px',
      marginRight: '5px',
    },
    action: {
      marginRight: theme.spacing(1),
      padding: 0,
    },
    mr1: {
      marginRight: theme.spacing(1),
    },
    text: {
      fontSize: '12px',
    },
    fill: {
      fill: 'none',
    },
    modal: {
      paddingBottom: 10,
    },
    copy: {
      width: 520,
    },
    subtitle: {
      fontWeight: theme.typography.fontWeightMedium,
      fontSize: '18px',
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
  }),
);
