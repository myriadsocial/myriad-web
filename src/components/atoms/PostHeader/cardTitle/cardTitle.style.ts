import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    link: {
      fontWeight: 400,
      lineHeight: '20.08px',
      textDecoration: 'none',
    },
  }),
);
