import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

import {CommentDeletedProps} from './CommentDeleted.interface';

export const useStyles = makeStyles<Theme, CommentDeletedProps>(theme =>
  createStyles({
    root: {
      display: 'flex',
      padding: props => (props.deep > 0 ? theme.spacing(0, 0, 0, 2) : theme.spacing(0, 2)),
    },
    comment: {
      marginBottom: theme.spacing(1),
      boxShadow: 'none',
      backgroundColor: 'rgba(246, 246, 246, 0.5)',

      '& .MuiCardHeader-root': {
        padding: '10px 4px',
      },

      '& .MuiCardActions-root': {
        padding: theme.spacing(1, 0),
      },
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
      display: 'flex',
      flexWrap: 'nowrap',
      alignItems: 'center',
      padding: theme.spacing(1, 0),

      '& .MuiSvgIcon-root': {
        fill: '#FFF',
        marginRight: 10,
      },
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
    fullWidth: {
      width: '100%',
    },
    tree: {
      display: 'flex',
      flexDirection: 'column',
      marginRight: theme.spacing(1),
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
      left: '-45px',
      width: '33px',
      height: '22px',
      borderBottom: '1px solid #E5E5E5',
      borderLeft: '1px solid #E5E5E5',
      borderBottomLeftRadius: '11px',
    },
    link: {
      color: theme.palette.text.secondary,
      textDecoration: 'none',
      fontStyle: 'italic',
    },
    hidden: {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
  }),
);
