import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: 12,
      '& .MuiListItem-root:nth-child(even)': {
        background: 'inherit',
      },
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
    },
    avatar: {
      height: 56,
      width: 56,
    },
  }),
);
