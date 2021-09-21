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
      borderBottom: '1px solid #E5E5E5',

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
        borderRadius: 5,
        color: '#12130F',

        '& .MuiTab-wrapper': {
          fontWeight: 600,
        },
      },

      '& .MuiTabs-indicator': {
        display: props => (props.mark === 'underline' ? 'block' : 'none'),
        height: theme.spacing(0.5),
        borderTopLeftRadius: theme.spacing(0.25),
        borderTopRightRadius: theme.spacing(0.25),
      },
    },
    tab: {
      marginRight: 20,
      minHeight: props => (props.size === 'small' ? 36 : 48),
      minWidth: props => (props.size === 'small' ? 36 : 48),
      padding: theme.spacing(0.5),
      color: props =>
        props.mark === 'underline' ? theme.palette.text.secondary : theme.palette.text.primary,
    },
  }),
);
