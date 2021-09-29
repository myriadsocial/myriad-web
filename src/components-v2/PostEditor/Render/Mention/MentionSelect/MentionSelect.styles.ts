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
    item: {
      cursor: 'pointer',
    },
    selected: {
      background: 'rgba(255, 200, 87, 0.15)',
    },
  }),
);
