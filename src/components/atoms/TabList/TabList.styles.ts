import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { TabMark, TabSize } from '.';

type StylesProps = {
  mark: TabMark;
  size: TabSize;
  background?: string;
  width?: string;
};

export const useStyles = makeStyles<Theme, StylesProps>(theme =>
  createStyles({
    root: {
      width: '100%',
    },
    tabs: {
      minHeight: props => (props.size === 'small' ? 36 : 48),
      background: props => props.background ?? 'transparent',

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
          props.mark === 'underline' ? 'transparent' : '#FFF',
        borderRadius: 8,
        color: '#12130F',

        '& .icon': {
          backgroundColor: props =>
            props.mark === 'underline'
              ? 'transparent'
              : theme.palette.secondary.main,
        },

        '& .MuiTab-wrapper': {
          fontWeight: 600,
        },
      },

      '& .icon': {
        display: 'flex',
        padding: '4px',
        borderRadius: 6,
      },

      '& .MuiTabs-indicator': {
        display: props => (props.mark === 'underline' ? 'block' : 'none'),
        height: theme.spacing(0.5),
        borderTopLeftRadius: theme.spacing(0.25),
        borderTopRightRadius: theme.spacing(0.25),
      },
    },
    tab: {
      minHeight: props => (props.size === 'small' ? 36 : 48),
      minWidth: props => (props.size === 'small' ? 36 : 48),
      padding: theme.spacing(0.5),
      color: props =>
        props.mark === 'underline'
          ? theme.palette.text.secondary
          : theme.palette.text.primary,
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(0.5, 1),
      },
      backgroundColor: props =>
        props.mark === 'underline' ? 'transparent' : '#FFF',
      width: props => (props.width ? props.width : 'auto'),
      borderRadius: props => (props.mark === 'underline' ? '0' : 8),
      boxShadow: props =>
        props.mark === 'underline'
          ? 'none'
          : '0px 6px 10px rgba(0, 0, 0, 0.05)',
    },
    indicator: {
      marginLeft: 4,
      width: '50%',
      height: props => (props.size === 'small' ? 4 : 6),
      display: props => (props.mark === 'underline' ? 'block' : 'none'),
      background: '#FFC857',
    },
    indicatorColor: {
      backgroundColor: 'transparent',
      height: 'auto',
    },
  }),
);
