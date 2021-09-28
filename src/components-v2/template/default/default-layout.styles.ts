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

    innerFirstColWrapper: {
      maxWidth: 360,
      display: 'flex',
      flexDirection: 'column',
      rowGap: 12,
    },

    secondCol: {
      flexGrow: 2,
      margin: 20,
    },

    innerSecondColWrapper: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      alignItems: 'center',
      rowGap: 12,
      '& > div': {
        width: '100%',
      },
    },

    thirdCol: {
      minWidth: 312,
    },

    innerThirdColWrapper: {
      maxWidth: 360,
      display: 'flex',
      flexDirection: 'column',
      rowGap: 12,
    },
  }),
);

export default useStyles;
