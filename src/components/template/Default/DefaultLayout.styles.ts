import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 30px 10px',
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
      position: 'fixed',
      top: 5,
      bottom: 20,
      overflowY: 'scroll',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': { display: 'none' },

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
      paddingTop: '10px',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      alignItems: 'center',
      rowGap: 12,
      '& > div': {
        width: '100%',
      },
      [theme.breakpoints.down('xs')]: {
        paddingTop: '0',
      },
    },

    thirdCol: {
      width: 312,
      // position: 'sticky',
      // top: 5,
      // bottom: 20,

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
      position: 'fixed',
      top: 5,
      bottom: 20,
      overflowY: 'scroll',
      overflowX: 'hidden',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': { display: 'none' },

      [theme.breakpoints.down('md')]: {
        width: 290,
      },
    },

    rightCard: {
      marginBottom: '12px',
    },
  }),
);

export default useStyles;
