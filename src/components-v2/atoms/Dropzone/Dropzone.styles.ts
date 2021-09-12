import {createStyles, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      border: '1px solid #E5E5E5',
      padding: 8,
      background: '#FFF',
      borderRadius: 5,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 180,
      position: 'relative',
    },
    loading: {
      position: 'absolute',
      left: 'calc(50% - 22px)',
      bottom: 16,
    },
    dropzone: {
      textAlign: 'center',
    },
  }),
);
