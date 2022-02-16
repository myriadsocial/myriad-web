import {makeStyles, createStyles, Theme, alpha} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    wrapper: {
      width: 360,
    },
    list: {
      paddingTop: 0,

      '& .MuiListItem-root:hover': {
        backgroundColor: alpha('#FFC857', 0.15),

        '&::before,&::after': {
          content: '""',
          position: 'absolute',
          width: 30,
          height: 61,
          top: 0,
          backgroundColor: alpha('#FFC857', 0.15),
        },
        '&::before': {
          left: -30,
        },
        '&::after': {
          right: -30,
        },
      },
    },
    accountDetail: {
      '& .MuiListItemText-secondary': {
        overflow: 'hidden',
        color: ' #4B4851',
        textOverflow: 'ellipsis',
      },
    },
    help: {
      padding: theme.spacing(1),
      textAlign: 'center',
      maxWidth: 390,
      marginLeft: 'auto',
      marginRight: 'auto',
      fontSize: 16,
      fontWeight: 600,
      fontStyle: 'normal',
      lineHeight: '24px',
    },
    actions: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      flexDirection: 'row',
      marginBottom: 24,
    },
    circle: {
      margin: theme.spacing(0, 0.5),
      fontSize: 10,
      color: '#BCBCBC',
    },
    buttonGroup: {
      width: '100%',
      padding: theme.spacing(2, 2, 0, 2),
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',

      '& .MuiButton-contained': {
        background: theme.palette.background.paper,
        fontSize: 16,
        fontWeight: 600,
        color: theme.palette.secondary.main,
      },
    },
  }),
);
