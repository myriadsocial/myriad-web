import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: 10,
      minWidth: 644,
      marginBottom: 12,

      [theme.breakpoints.down('md')]: {
        minWidth: 590,
      },

      [theme.breakpoints.down('xs')]: {
        minWidth: 0,
      },
    },
    content: {
      padding: theme.spacing(0.5, 2.5),
      wordBreak: 'break-all',
    },
    tags: {
      marginBottom: theme.spacing(1.5),
    },
    action: {
      padding: theme.spacing(1.25, 2.5),
    },
    tabs: {
      borderBottom: '1px solid #E5E5E5',

      '& .MuiTabs-flexContainer': {
        justifyContent: 'space-evenly',
      },

      '& .MuiTab-wrapper': {
        textTransform: 'capitalize',
        fontWeight: 'normal',
        fontSize: 16,
        lineHeight: '20px',
      },
    },
    sendTips: {
      width: 120,
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    icon: {
      display: 'none',
      border: '2px solid #FFDE81',
      '&, .MuiIconButton-root': {
        padding: '1px',
        marginLeft: 'auto',
      },
      [theme.breakpoints.down('xs')]: {
        display: 'block',
      },
    },
    fill: {
      fill: 'none',
      color: '#404040',
    },
  }),
);
