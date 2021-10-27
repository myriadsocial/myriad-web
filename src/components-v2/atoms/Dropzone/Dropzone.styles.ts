import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      border: '1px dashed #E5E5E5',
      padding: 8,
      background: '#FFF',
      borderRadius: 5,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 180,
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
    preview: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
    },
    image: {
      objectFit: 'cover',
      objectPosition: 'center',
      minHeight: 112,
      backgroundSize: 'cover',
    },
    icon: {
      color: theme.palette.primary.main,
      background: '#FFF',
      marginRight: 12,
      padding: 0,
      height: 24,
      width: 24,
      fontSize: '1rem',
    },
    button: {
      marginTop: 20,
    },
  }),
);
