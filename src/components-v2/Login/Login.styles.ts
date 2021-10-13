import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    button: {
      marginBottom: theme.spacing(4),
      width: '360px',
      height: 60,
      fontWeight: 400,
      fontFamily: theme.typography.fontFamily,
      background: theme.palette.primary.main,
      borderRadius: 20,
      color: '#FFF',
      '&:hover': {
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      },
      '& .MuiButton-label': {
        fontSize: 24,
        lineHeight: 30,
        fontWeight: 600,
      },
    },
    span: {
      marginBottom: theme.spacing(33),
      display: 'flex',
      alignItems: 'center',
      fontWeight: 400,
    },
    polkadot: {
      color: 'rgb(255, 140, 0)',
    },
    link: {
      padding: 0,
      fontSize: 18,
      fontWeight: 700,
      color: theme.palette.primary.main,
      textTransform: 'none',
      lineHeight: '22px',
      minWidth: 'initial',
      width: 'auto',
    },
  }),
);
