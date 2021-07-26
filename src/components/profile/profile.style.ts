import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 1024,
      background: theme.palette.background.default,
      paddingRight: '32px',
      marginRight: 'auto',
      height: '100vh',
      overflow: 'hidden',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      scrollbarColor: 'transparent transparent',
      '& ::-webkit-scrollbar': {
        display: 'none',
        width: '0 !important',
      },
    },
    flex: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scroll: {
      height: '100%',
      width: '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    child: {
      '& > *': {
        // margin: theme.spacing(1)
        marginTop: theme.spacing(1),
      },
    },
    loading: {
      position: 'absolute',
      top: 100,
      left: 'calc(50% - 20px)',
    },
    // TAB
    root2: {
      // backgroundColor: theme.palette.background.paper,
      width: 678,
      height: '100%',
      marginBottom: theme.spacing(1),
    },

    tabContent: {
      filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.16))',
      // background: theme.palette.background.paper
    },
    tabHeader: {
      // background: '#C4C4C4'
      // borderRadius: 8
    },
    tabItem: {
      // width: 130,
      // height: 56,
      color: theme.palette.primary.main,
      minHeight: 'unset',
      minWidth: 'unset',

      '&.Mui-selected': {
        // background: 'white',
        borderRadius: 8,
        background: theme.palette.primary.main,
        color: '#FFFFFF',
        // width: 157,

        '& .MuiTypography-root': {
          display: 'block',
          textTransform: 'capitalize',
          fontSize: 15,
        },
      },

      '& .MuiTypography-root': {
        display: 'none',
      },

      '& .MuiTab-wrapper': {
        flexDirection: 'row',
        '& >*:first-child': {
          marginBottom: 0,
        },
      },

      '& .MuiSvgIcon-root': {
        paddingRight: theme.spacing(0.5),
        width: 24,
        height: 24,
      },
    },
  }),
);
