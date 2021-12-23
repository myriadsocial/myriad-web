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
  }),
);
