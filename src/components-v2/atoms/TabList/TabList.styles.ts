import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {TabPosition, TabMark, TabSize} from '.';

type StylesProps = {
  position: TabPosition;
  mark: TabMark;
  size: TabSize;
};

export const useStyles = makeStyles<Theme, StylesProps>(theme =>
  createStyles({
    root: {
      width: '100%',
    },
    tabs: {
      minHeight: props => (props.size === 'small' ? 36 : 48),

      '& .MuiTabs-flexContainer': {
        justifyContent: props => props.position,
      },

      '& .MuiTabs-scroller': {
        height: props => (props.size === 'small' ? 36 : 48),
      },

      '& .MuiTab-wrapper': {
        textTransform: 'capitalize',
        fontWeight: 'normal',
        fontSize: props => (props.size === 'small' ? 14 : 16),
        lineHeight: '20px',
      },

      '& .Mui-selected': {
        backgroundColor: props =>
          props.mark === 'underline' ? 'transparent' : theme.palette.secondary.main,
      },

      '& .MuiTabs-indicator': {
        display: props => (props.mark === 'underline' ? 'block' : 'none'),
      },
    },
    tab: {
      marginRight: 20,
      minHeight: props => (props.size === 'small' ? 36 : 48),
      minWidth: props => (props.size === 'small' ? 36 : 48),
      padding: theme.spacing(0.5),
    },
  }),
);
