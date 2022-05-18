import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'absolute',
      zIndex: 2000,
      top: -9999,
      left: -9999,
      background: '#FFFFFF',
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
      borderRadius: 10,
      '& > div': {
        padding: theme.spacing(0, 2),
      },
    },
    wrapper: {
      maxHeight: 280,
      overflowY: 'auto',

      '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
        borderRadius: 10,
        backgroundColor: '#E5E5E5',
      },

      '&::-webkit-scrollbar': {
        width: 12,
        backgroundColor: '#E5E5E5',
      },

      '&::-webkit-scrollbar-thumb': {
        borderRadius: 10,
        boxShadow: 'inset 0 0 6px rgba(0,0,0,.3)',
        backgroundColor: theme.palette.primary.main,
      },
    },
    item: {
      cursor: 'pointer',

      '&:hover': {
        background: 'rgba(255, 200, 87, 0.15)',
      },
    },
    selected: {
      background: 'rgba(255, 200, 87, 0.15)',
    },
  }),
);
