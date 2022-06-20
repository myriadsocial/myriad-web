import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

type StylesProps = {
  border?: 'solid' | 'dashed';
  error?: boolean;
};

export const useStyles = makeStyles<Theme, StylesProps>(theme =>
  createStyles({
    root: {
      borderColor: props => (props.error ? '#f44336' : '#E5E5E5'),
      borderStyle: props => props.border,
      borderWidth: props => (props.border ? '1px' : 'none'),
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
    dropzone: {
      textAlign: 'center',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    button: {
      marginTop: 20,
      [theme.breakpoints.down('xs')]: {
        width: 'auto',
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
      },
    },
    placeholder: {
      [theme.breakpoints.down('xs')]: {
        fontSize: '12px',
        color: '#757575',
      },
    },
  }),
);
