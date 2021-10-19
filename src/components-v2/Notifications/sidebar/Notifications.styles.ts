import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: 24,
      borderRadius: '20px',
    },
    header: {
      textAlign: 'center',
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
      height: '500px',
      overflow: 'scroll',
    },
    item: {
      position: 'relative',
      '& .MuiListItemText-root': {
        alignItems: 'start',
      },
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
    },
    textMain: {
      fontSize: '16px',
    },
    textSecondary: {
      fontSize: '12px',
      '& .MuiTypography-body1': {
        fontSize: '12px',
      },
    },
    date: {
      top: '25px',
    },
    footer: {
      textAlign: 'center',
      paddingTop: theme.spacing(1),
    },
  }),
);
