import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {width: '643px', borderRadius: '20px', padding: 0},
    flex: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      padding: '24px',
      fontSize: '18px',
      fontWeight: 700,
      lineHeight: '23px',
      letterSpacing: '0em',
    },
    list: {},
    item: {
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
      '& .MuiListItemText-root': {
        alignSelf: 'center',
      },
    },
    avatar: {
      width: 40,
      height: 40,
      marginRight: 16,
      background: '#424242',
    },
    link: {textDecoration: 'none'},
    name: {
      fontSize: '16px',
      lineHeight: '20.08px',
      fontWeight: 400,
    },
    friend: {
      fontSize: '12px',
      lineHeight: '15.06px',
      fontWeight: 400,
    },
    button: {width: 'auto'},
    fill: {fill: 'none'},
    buttonText: {
      fontWeight: 600,
      fontSize: '14px',
    },
    error: {color: '#FE3636'},
    list: {},
  }),
);
