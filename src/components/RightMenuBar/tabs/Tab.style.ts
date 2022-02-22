import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 auto',
      background: 'transparent',
      '& .MuiBox-root': {
        paddingTop: 0,
      },
      [theme.breakpoints.down('xs')]: {
        padding: '0px 20px',
      },
    },
    content: {
      padding: theme.spacing(0, 3.75),
      background: '#FFF',
      boxShadow: `0px 2px 10px rgba(0, 0, 0, 0.05)`,
      borderRadius: `20px`,
      [theme.breakpoints.down('xs')]: {
        borderRadius: `10px`,
      },
    },
    action: {
      fontWeight: theme.typography.fontWeightMedium,
      margin: '20px 0',
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline',
      },
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    title: {
      marginBottom: 12,
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    box: {
      [theme.breakpoints.down('xs')]: {
        padding: '0px 20px',
      },
    },
    desktop: {
      marginBottom: 12,
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
  }),
);
