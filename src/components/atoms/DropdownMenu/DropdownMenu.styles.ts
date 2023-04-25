import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

type DropdownMenuStyleProp = {
  useIconOnMobile: boolean;
  marginBottom?: boolean;
  marginTop?: boolean;
  experience?: boolean;
};

export const useStyles = makeStyles<Theme, DropdownMenuStyleProp>(theme =>
  createStyles({
    root: {
      display: 'flex',
      marginBottom: props => (props.marginBottom ? theme.spacing(2) : 0),
      marginTop: props => (props.marginTop ? theme.spacing(1.5) : 0),

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
      fontSize: props => (props.experience ? 13 : 14),
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    selected: {
      fontSize: props => (props.experience ? 13 : 14),
      fontWeight: 600,
      maxWidth: '100px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
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
