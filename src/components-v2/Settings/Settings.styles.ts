import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3.75, 0),
    },
    title: {
      fontSize: theme.typography.h4.fontSize,
      fontWeight: 700,
      paddingLeft: theme.spacing(3.75),
      paddingBottom: theme.spacing(5),
    },
    option: {
      paddingLeft: 30,
      paddingTop: 18,
      paddingBottom: 18,
      '&:hover ': {
        background: `rgba(255, 200, 87, 0.15)`,
      },
      '& .hidden-button': {
        display: 'none',
      },
      '&:hover .hidden-button': {
        display: 'flex',
        paddingRight: 29,
      },
    },
  }),
);
