import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      [theme.breakpoints.down('xs')]: {
        padding: '0px 20px',
      },
    },
    root: {
      marginTop: 12,
      '& .MuiListItem-root:nth-child(even)': {
        background: 'inherit',
      },
      background: theme.palette.background.paper,
      borderRadius: '10px',
    },
    list: {
      display: 'flex',
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      width: 'auto',
      marginRight: 20,

      '& .MuiListItemIcon-root': {
        minWidth: 40,
      },
      cursor: 'pointer',
    },
    avatar: {
      height: 56,
      width: 56,
    },
    mt30: {
      marginTop: '30px',
    },
    empty: {
      background: 'transparent',
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '20px 0',

      [theme.breakpoints.down('xs')]: {
        padding: 20,
      },
    },
  }),
);
