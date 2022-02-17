import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 30px',

      [theme.breakpoints.down('xs')]: {
        padding: '0px',
      },
    },
    firstCol: {
      width: 312,

      [theme.breakpoints.down('md')]: {
        width: 290,
      },

      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },

    innerFirstColWrapper: {
      width: 312,
      display: 'flex',
      flexDirection: 'column',
      rowGap: 12,

      [theme.breakpoints.down('md')]: {
        width: 290,
      },
    },

    secondCol: {
      flexGrow: 2,
      maxWidth: 644,
      margin: `0 20px`,

      [theme.breakpoints.down('md')]: {
        maxWidth: 590,
      },

      [theme.breakpoints.down('xs')]: {
        maxWidth: '100%',
        margin: `0px`,
      },
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
      width: 312,

      [theme.breakpoints.down('md')]: {
        width: 290,
      },
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },

    innerThirdColWrapper: {
      width: 312,
      display: 'flex',
      flexDirection: 'column',
      rowGap: theme.spacing(1),

      [theme.breakpoints.down('md')]: {
        width: 290,
      },
    },
  }),
);

export default useStyles;
