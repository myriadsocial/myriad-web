import {createStyles, Theme, makeStyles, alpha} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      margin: '8px 0',
      padding: 16,
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
      marginLeft: theme.spacing(-2),
      marginRight: theme.spacing(-2),
      '& .MuiListItem-button:hover': {
        backgroundColor: alpha('#FFC857', 0.15),
      },
    },
    item: {
      marginBottom: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
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
    avatar: {
      width: '40px',
      height: '40px',
      marginRight: 10,
    },
    avatarItem: {
      paddingLeft: 14,
    },
    secondaryItem: {
      paddingRight: 14,
    },
    textItem: {
      paddingLeft: 6,
    },
  }),
);
