import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

import {CommentDetailProps} from './CommentDetail.interface';

export const useStyles = makeStyles<Theme, CommentDetailProps>(theme =>
  createStyles({
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
    content: {
      padding: theme.spacing(0, 0.5),
    },
    dot: {
      color: '#C4C4C4',
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
    button: {
      width: 'auto',
      height: 'auto',
    },
    flex: {
      display: 'flex',
      padding: props => (props.deep > 0 ? theme.spacing(0, 0, 0, 2) : theme.spacing(0, 2)),
    },
    flexSpaceBetween: {
      display: 'flex',
      justifyContent: 'space-between',
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
      fontWeight: 600,
      color: theme.palette.text.primary,
      textDecoration: 'none',
    },
    cursor: {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
    hidden: {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
  }),
);
