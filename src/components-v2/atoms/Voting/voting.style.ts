import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

type VotingStyleProp = {
  variant: 'row' | 'column';
  size: 'small' | 'medium';
};

export const useStyles = makeStyles<Theme, VotingStyleProp>(() =>
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
  }),
);
