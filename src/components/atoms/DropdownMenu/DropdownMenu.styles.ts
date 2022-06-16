import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

type DropdownMenuStyleProp = {
  useIconOnMobile: boolean;
};

export const useStyles = makeStyles<Theme, DropdownMenuStyleProp>(theme =>
  createStyles({
    root: {
      display: 'flex',
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(1.5),

      [theme.breakpoints.down('xs')]: {
        marginBottom: 20,
        marginTop: 20,
      },
    },
    content: {
      [theme.breakpoints.down('xs')]: {
        display: props => (props.useIconOnMobile ? 'none' : 'flex'),
      },
    },
    title: {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    selected: {
      fontWeight: 600,
    },
    expand: {
      marginLeft: theme.spacing(1),
      padding: 0,
    },
    sort: {
      display: 'none',
      padding: '0px 8px',
      [theme.breakpoints.down('xs')]: {
        display: props => (props.useIconOnMobile ? 'block' : 'none'),
        padding: 0,
      },
    },
  }),
);
