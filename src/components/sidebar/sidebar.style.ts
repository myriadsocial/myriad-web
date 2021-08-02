import {makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 331,
    minHeight: '100vh',
  },
  tabHeader: {
    background: '#C4C4C4',
    borderRadius: 8,
  },
  tabItem: {
    width: 85,
    height: 56,
    minHeight: 'unset',
    minWidth: 'unset',

    '&.Mui-selected': {
      background: '#767676',
      color: '#000000',
      width: 157,

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
}));
