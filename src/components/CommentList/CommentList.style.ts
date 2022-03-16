import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
    },
    more: {
      marginLeft: 69,
      cursor: 'pointer',
    },
    horizontalTree: {
      position: 'absolute',
      top: 0,
      left: -29,
      width: 1,
      height: 'calc(100% - 8px)',
      borderLeft: '1px solid #E5E5E5',
    },
  }),
);
