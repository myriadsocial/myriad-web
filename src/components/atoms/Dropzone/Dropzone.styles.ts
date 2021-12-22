import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

type StylesProps = {
  border: boolean;
  multiple?: boolean;
};

export const useStyles = makeStyles<Theme, StylesProps>(theme =>
  createStyles({
    root: {
      border: props => (props.border ? '1px dashed #E5E5E5' : 'none'),
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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    preview: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
    },
    item: {
      padding: theme.spacing(1, 1, 1, 0),
      height: '100%',
      display: 'block',
    },
    image: {
      objectFit: 'cover',
      objectPosition: 'center',
      height: props => (props.multiple === false ? '80px' : '100%'),
      width: props => (props.multiple === false ? '80px' : '100%'),
      marginTop: 20,
    },
    icon: {
      filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.16))',
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
