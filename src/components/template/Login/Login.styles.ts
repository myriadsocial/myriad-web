import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: 20,
      backgroundColor: '#FFC857',
      height: '100vh',
    },
    paper: {
      height: '100vh',
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
      backgroundColor: '#F6F7FC',
      paddingTop: 80,
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
      marginBottom: 24,
      height: 48,
    },
    title: {
      fontWeight: 700,
      lineHeight: '20px',
      marginBottom: 40,
      color: theme.palette.text.primary,
    },
    titlePrimary: {
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
      lineHeight: '35.14px',
      fontWeight: 700,
    },
    mb1: {
      marginBottom: theme.spacing(1),
    },
    subtitle: {
      fontWeight: 400,
      lineHeight: '26px',
    },
    border: {
      border: 0,
    },
    carouselIndicatior: {
      color: '#FFF',

      '&:active, :hover': {
        color: '#FFF',
      },

      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
    carouselActiveIndicatior: {
      color: '#7342CC',
      width: 28,
      background: '#7342CC',
      borderRadius: 20,

      '&:active, :hover': {
        color: '#7342CC',
        background: '#7342CC',
        borderRadius: 20,
      },

      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
  }),
);
