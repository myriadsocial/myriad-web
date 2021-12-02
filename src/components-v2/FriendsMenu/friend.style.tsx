import {alpha, createStyles, makeStyles, Theme} from '@material-ui/core/styles';

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
    list: {
      padding: '20px',
      '& .MuiListItem-button:hover': {
        backgroundColor: alpha('#FFC857', 0.15),
      },
    },
    item: {
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
      '& .MuiListItemText-root': {
        alignSelf: 'center',
      },
    },
    backgroundEven: {
      '&:nth-child(even)': {
        backgroundColor: '#F2F2F4',
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
    icon: {
      color: '#FFF',
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    error: {
      background: theme.palette.secondary.main,
      color: '#FFF',
      '&:hover': {
        color: theme.palette.text.primary,
      },
    },
    option: {
      '& .hidden-button': {
        display: 'none',
      },
      '&:hover .hidden-button': {
        display: 'flex',
      },
      '&:hover': {
        background: 'rgba(255, 200, 87, 0.15)',
      },
    },
    iconbutton: {
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: '#e5e5e5',
        opacity: 0.8,
      },
      width: '32px',
      height: '32px',
    },
    dropdownMenu: {
      marginBottom: theme.spacing(1.5),
    },
    danger: {
      color: theme.palette.error.main,
    },
    flexCenter: {
      display: 'flex',
      justifyContent: 'center',
    },
    m1: {
      marginRight: theme.spacing(3),
    },
  }),
);
