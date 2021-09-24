import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    firstCol: {
      minWidth: 312,
    },

    secondCol: {
      flexGrow: 2,
      margin: `0 20px`,
    },

    thirdCol: {
      minWidth: 312,
    },
  }),
);

export default useStyles;
