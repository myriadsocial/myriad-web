import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    firstCol: {
      flex: `1 1 0`,
    },

    secondCol: {
      flex: `1 2 0`,
      margin: 20,
    },

    thirdCol: {
      flex: `2 1 0`,
    },
  }),
);

export default useStyles;
