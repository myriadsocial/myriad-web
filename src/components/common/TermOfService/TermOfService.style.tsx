import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginRight: 0,
    },
    checkBox: {
      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
        color: theme.palette.primary.main,
      },
    },
    text: {
      fontSize: 12,
      fontWeight: 400,
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      fontWeight: theme.typography.fontWeightBold,
    },
  }),
);
