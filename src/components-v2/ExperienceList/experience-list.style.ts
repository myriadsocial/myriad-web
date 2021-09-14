import {createStyles, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: 311,
      height: 110,
      position: 'relative',
      '& .MuiListItem-gutters': {
        paddingLeft: 0,
      },
    },
  }),
);
