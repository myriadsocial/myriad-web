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
    fill: {
      fill: 'none',
      width: 18,
      height: 18,
      color: '#404040',
    },
    red: {
      color: 'red',
    },
    default: {
      color: 'rgba(0, 0, 0, 0.54)',
    },
  }),
);
