import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: '20px',
      backgroundColor: '#FFC857',
      width: '1366px',
    },
    paper: {
      minHeight: '768px',
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.background.paper,
    },
    flex: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    background: {
      backgroundColor: '#FFC857',
      position: 'relative',
    },
    logo: {
      marginTop: '70px',
      marginBottom: '10px',
      fontSize: '500px',
    },
    title: {
      fontSize: 16,
      fontWeight: 700,
      lineHeight: '20px',
      marginBottom: theme.spacing(10),
      color: theme.palette.text.primary,
    },
    titlePrimary: {
      color: theme.palette.primary.main,
    },
    button: {
      marginBottom: theme.spacing(4),
      width: '360px',
      height: '60px',
      fontSize: '24px',
      fontWeight: 400,
      fontFamily: theme.typography.fontFamily,
      background: theme.palette.primary.main,
      color: '#FFF',
      '&:hover': {
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      },
    },
    span: {
      marginBottom: theme.spacing(33),
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.primary.main,
    },
    imagePurple: {
      position: 'absolute',
      top: '250px',
      left: '-55px',
    },
    imageYellow: {
      position: 'absolute',
      top: '100px',
      left: '165px',
    },
    carousel: {
      position: 'absolute',
      width: '400px',
      height: '100px',
      bottom: '100px',
      '& .rec.rec-arrow': {
        visibility: 'hidden',
        display: 'none',
      },
      '& .rec.rec-dot': {
        background: theme.palette.background.paper,
        boxShadow: 'none',
        width: '12px',
        height: '12px',
      },
      '& .rec.rec-dot.jJKuoL': {
        width: '28px',
        background: theme.palette.primary.main,
        borderRadius: 20,
      },
      '& .rec.rec-dot:focus': {
        background: theme.palette.primary.main,
        width: '28px',
        borderRadius: 20,
      },
      '& .rec.rec-pagination': {
        paddingLeft: '8px',
      },
      '& .rec-carousel-wrapper': {
        alignItems: 'flex-start',
      },
    },
    caption: {
      fontSize: '28px',
      lineHeight: '35.14px',
      fontWeight: 700,
    },
    mb1: {
      marginBottom: theme.spacing(1),
    },
    subtitle: {
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: '18px',
      lineHeight: '26px',
    },
    border: {
      border: 0,
    },
  }),
);
