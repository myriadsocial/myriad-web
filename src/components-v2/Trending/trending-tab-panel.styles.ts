import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 auto',
      background: 'transparent',
      '& .MuiBox-root': {
        paddingTop: 0,
      },
    },
    content: {
      padding: theme.spacing(0, 3.75),
      background: '#FFF',
      boxShadow: `0px 2px 10px rgba(0, 0, 0, 0.05)`,
      borderRadius: `20px 20px 0px 0px`,
    },
  }),
);
