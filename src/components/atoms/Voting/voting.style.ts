import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

type VotingStyleProp = {
  variant: 'row' | 'column';
  size: 'small' | 'medium';
};

export const useStyles = makeStyles<Theme, VotingStyleProp>(theme =>
  createStyles({
    root: {
      display: 'inline-block',
    },
    icon: {
      display: 'flex',
      flexDirection: props => props.variant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    action: {
      padding: 0,

      '& .MuiSvgIcon-fontSizeLarge': {
        fontSize: props => (props.size === 'small' ? 24 : 32),
      },
    },
    mr1: {
      marginRight: props => (props.variant === 'row' ? 6 : 0),
    },
    default: {
      fill: 'none',
      width: 18,
      height: 18,
      color: '#404040',
    },
    primary: {
      fill: 'none',
      width: 18,
      height: 18,
      color: theme.palette.primary.main,
    },
    error: {
      fill: 'none',
      width: 18,
      height: 18,
      color: theme.palette.error.dark,
    },
  }),
);
