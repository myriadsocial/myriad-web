import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    checkBox: {
      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
        color: theme.palette.primary.main,
      },
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      fontWeight: theme.typography.fontWeightBold,
    },
  }),
);
