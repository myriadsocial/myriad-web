import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 416,
      padding: theme.spacing(2),
    },
    table: {},
    list: {
      maxHeight: 360,
      overflowY: 'auto',
    },
    item: {
      '& .MuiListItemText-primary': {
        fontWeight: 400,
        fontSize: 16,
        lineHeight: '19px',
      },

      '& .MuiTypography-colorTextSecondary': {
        color: theme.palette.primary.dark,
      },
    },
    avatar: {
      minWidth: 20,
    },
    done: {
      flexDirection: 'column',
    },
  }),
);
