import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    firstCol: {
      width: 312,
    },

    secondCol: {
      flexGrow: 2,
      margin: 20,
    },

    thirdCol: {
      width: 312,
    },
  }),
);

export default useStyles;
