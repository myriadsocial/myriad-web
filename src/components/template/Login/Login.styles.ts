import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: '20px',
      backgroundColor: '#FFC857',
      height: '100vh',
    },
    paper: {
      height: '100vh',
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
