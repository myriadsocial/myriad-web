import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(0, 3.75),
    },
    title: {
      fontSize: theme.typography.h4.fontSize,
      fontWeight: 700,
      paddingLeft: theme.spacing(3.75),
      paddingBottom: theme.spacing(5),
    },
    text: {
      fontSize: '12px',
      color: theme.palette.text.secondary,
    },
    item: {
      paddingLeft: theme.spacing(3.75),
      paddingRight: theme.spacing(3.75),
      '& .MuiListItemText-root': {
        alignSelf: 'center',
      },
      '&:hover ': {
        background: `rgba(255, 200, 87, 0.15)`,
      },
      '& .hidden-button': {
        display: 'none',
        right: '30px',
      },
      '&:hover .hidden-button': {
        display: 'flex',
      },
    },
    name: {
      fontSize: '16px',
      lineHeight: '20.08px',
      fontWeight: 400,
    },
    button: {
      width: 'auto',
      height: 'auto',
      color: theme.palette.primary.main,
      padding: '0px',
    },
  }),
);
