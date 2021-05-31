import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '881px',
      minWidth: '590px',
      paddingRight: '32px',
      marginRight: 'auto',
      height: '100vh',
      overflow: 'hidden',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      scrollbarColor: 'transparent transparent',
      '& ::-webkit-scrollbar': {
        display: 'none',
        width: '0 !important'
      }
    },
    scroll: {
      height: '100%',
      width: '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    child: {
      '& > *': {
        // margin: theme.spacing(1)
        marginTop: theme.spacing(1)
      }
    },
    loading: {
      position: 'absolute',
      top: 100,
      left: 'calc(50% - 20px)'
    },
    // TAB
    root2: {
      // backgroundColor: theme.palette.background.paper,
      width: 678,
      height: '100%'
    },
    tabHeader: {
      // background: '#C4C4C4'
      // borderRadius: 8
    },
    tabItem: {
      // width: 130,
      // height: 56,
      color: '#8629E9',
      minHeight: 'unset',
      minWidth: 'unset',

      '&.Mui-selected': {
        // background: 'white',
        borderRadius: 8,
        background: '#8629E9',
        color: '#FFFFFF',
        // width: 157,

        '& .MuiTypography-root': {
          display: 'block',
          textTransform: 'capitalize',
          fontSize: 15
        }
      },

      '& .MuiTypography-root': {
        display: 'none'
      },

      '& .MuiTab-wrapper': {
        flexDirection: 'row',
        '& >*:first-child': {
          marginBottom: 0
        }
      },

      '& .MuiSvgIcon-root': {
        paddingRight: theme.spacing(0.5),
        width: 24,
        height: 24
      }
    }
  })
);
