import {createStyles, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'inline-block',
    },
    action: {
      display: 'block',
      position: 'relative',
      top: 10,
    },
    header: {
      position: 'relative',
      background: '#FFF',

      '& .MuiCardHeader-title': {
        fontSize: 18,
        lineHeight: '24px',
        fontWeight: 'bold',
      },
    },
  }),
);
