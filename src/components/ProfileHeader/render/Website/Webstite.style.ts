import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: 22,
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing(1),
      },
    },
    fill: {
      fill: 'none',
    },
    icon: {
      marginRight: theme.spacing(1),
      fontSize: 20,
    },
    link: {
      color: '#FFF',
      marginRight: 20,
      wordBreak: 'break-word',
    },
    website: {
      fontSize: '12px',
      [theme.breakpoints.down('xs')]: {
        fontSize: '12px',
      },
    },
  }),
);
