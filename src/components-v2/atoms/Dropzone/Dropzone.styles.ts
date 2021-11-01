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
      width: '100%',
    },
    loading: {
      position: 'absolute',
      left: 'calc(50% - 22px)',
      bottom: 16,
    },
    dropzone: {
      textAlign: 'center',
      width: '100%',
    },
    preview: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
    },
    image: {
      objectFit: 'cover',
      objectPosition: 'center',
      height: '100%',
    },
    icon: {
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
      color: theme.palette.primary.main,
      background: '#FFF',
      padding: 0,
      height: 24,
      width: 24,
      fontSize: '1rem',
      position: 'absolute',
      top: 0,
      right: 0,

      '&:hover': {
        background: '#FFF',
      },
    },
    button: {
      marginTop: 20,
    },
  }),
);
