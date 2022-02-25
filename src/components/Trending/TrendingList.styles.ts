import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'block',
      '& .MuiList-padding': {
        paddingTop: 30,
      },
    },
    list: {
      '& .MuiListItem-gutters': {
        paddingLeft: 0,
        paddingRight: 0,
      },
      wordBreak: 'break-all',
    },
    item: {
      '& .MuiListItemText-primary': {
        fontWeight: 400,
        lineHeight: '19px',
      },

      '& .MuiTypography-colorTextSecondary': {
        color: theme.palette.primary.dark,
      },
    },
    avatar: {
      minWidth: 20,
    },
    text: {
      '& > a': {
        color: theme.palette.text.primary,
        textDecoration: 'none',
      },
    },
    mobile: {
      display: 'none',
      marginBottom: 12,
      fontSize: '16px',
      fontWeight: theme.typography.fontWeightMedium,
      [theme.breakpoints.down('xs')]: {
        display: 'block',
      },
    },
    title: {
      color: theme.palette.primary.main,

      [theme.breakpoints.down('xs')]: {
        fontSize: '16px',
      },
    },
    subtitle: {
      color: theme.palette.text.secondary,

      [theme.breakpoints.down('xs')]: {
        fontSize: '10px',
      },
    },
  }),
);
