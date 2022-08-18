import {makeStyles, createStyles, Theme, alpha} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    wrapper: {
      width: 360,
    },
    list: {
      paddingTop: 10,

      '& .MuiListItem-root:hover': {
        backgroundColor: alpha('#FFC857', 0.15),

        '&::before,&::after': {
          content: '""',
          position: 'absolute',
          width: 30,
          height: 50,
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
    walletDetail: {
      fontSize: '16px',
      lineHeight: '20.08px',
      fontWeight: 400,
    },
    modal: {
      padding: theme.spacing(4, 4, 0, 4),
    },
    walletCard: {
      height: '40',
      width: '40',
      margin: 'auto',
      paddingRight: '10',
    },
    icon: {
      fontSize: 32,
      marginRight: 8,
      [theme.breakpoints.down('md')]: {
        width: 60,
        fontSize: 26,
      },
    },
  }),
);
