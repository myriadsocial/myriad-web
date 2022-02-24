import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      '& .MuiDrawer-paper': {
        background: 'none',
      },
    },
    root: {
      padding: 20,
      minHeight: '243px',
      background: theme.palette.background.paper,
      borderRadius: '20px 20px 0px 0px',
      textAlign: 'center',
    },
    fill: {
      fill: 'currentColor',
      fontSize: 50,
      color: '#FFC857',
    },
    title: {
      fontWeight: theme.typography.fontWeightMedium,
      fontSize: '18px',
    },
    text: {
      fontWeight: theme.typography.fontWeightRegular,
      marginBottom: theme.spacing(4),
      whiteSpace: 'pre-line',
      fontSize: '14px',
    },
  }),
);
