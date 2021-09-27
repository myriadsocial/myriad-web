import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'block',
    },
    list: {
      marginLeft: theme.spacing(-2),
      marginRight: theme.spacing(-2),
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
    text: {
      '& > a': {
        color: theme.palette.text.primary,
      },
    },
  }),
);
