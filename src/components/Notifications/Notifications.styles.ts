import {createStyles, Theme, makeStyles, alpha} from '@material-ui/core/styles';

type NotificationComponentProps = {
  gutter?: number;
  size?: 'small' | 'medium';
};

export const useStyles = makeStyles<Theme, NotificationComponentProps>(theme =>
  createStyles({
    root: {
      width: '100%',
      margin: theme.spacing(1, 0),
      padding: props => (props.gutter ? theme.spacing(1 * props.gutter) : 0),
      borderRadius: props => (props.size === 'medium' ? 10 : 20),
    },
    header: {
      paddingTop: 14,
      paddingRight: 14,
      paddingLeft: 14,
    },
    title: {
      fontSize: theme.typography.h4.fontSize,
      fontWeight: 700,
    },
    content: {
      '&:last-child': {
        paddingBottom: 0,
      },
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      fontWeight: 600,
    },
    list: {
      marginLeft: props => (props.gutter ? theme.spacing(-1 * props.gutter) : 0),
      marginRight: props => (props.gutter ? theme.spacing(-1 * props.gutter) : 0),
      '& .MuiListItem-button:hover': {
        backgroundColor: alpha('#FFC857', 0.15),
      },
    },
    item: {
      marginBottom: theme.spacing(0.5),
      paddingRight: 0,
      paddingTop: props => (props.gutter ? theme.spacing(0.5 * props.gutter) : 0),
      position: 'relative',

      '& .MuiListItemText-root': {
        alignSelf: 'center',
      },
    },
    unread: {
      backgroundColor: alpha('#FFC857', 0.15),
    },
    circle: {
      background: theme.palette.primary.main,
      borderRadius: '50%',
      width: 20,
      height: 20,
      textAlign: 'center',
    },
    circleError: {
      background: '#FE3333',
      borderRadius: '50%',
      width: 20,
      height: 20,
      textAlign: 'center',
    },
    circleSuccess: {
      background: '#FFF',
      borderRadius: '50%',
      width: 20,
      height: 20,
      textAlign: 'center',
    },
    avatarItem: {
      paddingLeft: 14,
    },
    description: {
      width: 'calc(100% - 86px)',
      fontWeight: 400,
    },
    time: {
      top: 8,
      transform: 'none',
      textAlign: 'right',
      paddingRight: props => (props.size === 'medium' ? 14 : 0),
      width: props => (props.size === 'medium' ? 106 : 80),
    },
    textItem: {
      paddingLeft: 6,
    },
    footer: {
      textAlign: 'center',
      paddingBottom: 20,
    },
  }),
);
