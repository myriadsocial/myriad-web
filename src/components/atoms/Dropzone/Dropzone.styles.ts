import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

type StylesProps = {
  border?: 'solid' | 'dashed';
  error?: boolean;
  usage?: string;
};

export const useStyles = makeStyles<Theme, StylesProps>(theme =>
  createStyles({
    root: {
      borderColor: props => (props.error ? '#f44336' : '#E5E5E5'),
      borderStyle: props => {
        if (props.usage === 'experience') return 'none';
        else return props.border;
      },
      borderWidth: props => (props.border ? '1px' : 'none'),
      padding: props => (props.usage === 'experience' ? 0 : 8),
      background: '#FFF',
      borderRadius: 5,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: props => (props.usage === 'experience' ? 0 : 180),
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
    boxImage: {
      width: 100,
      height: 100,
      borderRadius: 10,
      border: '2px dashed #C2C2C2',
      backgroundColor: '#F5F5F5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(117, 117, 117, 1)',
    },
    fill: {
      fill: 'none',
      '& .MuiSvgIcon-root': {
        fill: 'none',
      },
    },
  }),
);
