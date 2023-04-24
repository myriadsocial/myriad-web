import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'none',
      [theme.breakpoints.down('xs')]: {
        display: 'flex',
        width: '100%',
        background: '#FFF',
        height: '56px',
        padding: theme.spacing(0, 2.5),
      },
    },
    fill: {
      fill: 'currentColor',
      color: '#404040',
    },
    icon: {
      color: '#404040',
      marginRight: theme.spacing(1),
    },
    notification: {
      width: 40,

      '& .MuiIconButton-root': {
        padding: 8,
      },
      '& .MuiBadge-dot': {
        backgroundColor: theme.status.danger.main,
      },
    },
  }),
);
