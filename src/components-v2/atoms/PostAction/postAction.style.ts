import {createStyles, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles(() =>
  createStyles({
    root: {},
    section: {
      display: 'inline-block',
      marginLeft: '5px',
      marginRight: '5px',
    },
    action: {
      padding: 0,
    },
    text: {
      fontSize: '12px',
    },
  }),
);
