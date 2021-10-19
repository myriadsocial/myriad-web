import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '550px',
    },
    item: {
      padding: theme.spacing(3, 3.75, 3, 3.75),
      '& .MuiListItemText-root': {
        alignSelf: 'center',
      },
      '&:hover ': {
        background: `rgba(255, 200, 87, 0.15)`,
        cursor: 'pointer',
      },
    },
    name: {
      fontSize: '16px',
      lineHeight: '20.08px',
      fontWeight: 400,
    },
  }),
);
