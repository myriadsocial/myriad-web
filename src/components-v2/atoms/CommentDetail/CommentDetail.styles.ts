import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    comment: {
      marginBottom: theme.spacing(1),
      boxShadow: 'none',
      backgroundColor: 'rgba(246, 246, 246, 0.5)',
    },
    circle: {
      margin: theme.spacing(0, 0.5),
      color: 'red',
      fontSize: 10,
      '& .MuiSvgIcon-root': {
        fill: 'red',
      },
    },
    content: {
      padding: theme.spacing(1, 2),
    },
    text: {
      fontSize: '14px',
      fontWeight: 700,
    },
    subText: {
      fontSize: '12px',
      color: theme.palette.text.secondary,
      fontWeight: 400,
    },
    dot: {
      color: '#C4C4C4',
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
    button: {
      width: 'auto',
      height: 'auto',
      color: theme.palette.text.secondary,
    },
    flex: {
      display: 'flex',
    },
    avatar: {
      marginRight: 12,
    },
    fullWidth: {
      width: '100%',
    },
    tree: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
    verticalTree: {
      marginTop: '8px',
      marginBottom: '8px',
      width: '20px',
      height: '100%',
      borderRight: '1px solid #E5E5E5',
    },
    horizontalTree: {
      position: 'absolute',
      top: 0,
      left: '-32px',
      width: '22px',
      height: '22px',
      borderBottom: '1px solid #E5E5E5',
      borderLeft: '1px solid #E5E5E5',
      borderBottomLeftRadius: '11px',
    },
  }),
);
