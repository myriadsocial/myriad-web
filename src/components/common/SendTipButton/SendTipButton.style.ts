import {PropTypes} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

type SendTipButtonProps = {
  mobile: boolean;
  color?: PropTypes.Color;
};

export const useStyles = makeStyles<Theme, SendTipButtonProps>(theme =>
  createStyles({
    root: {},
    button: {
      '&.MuiButton-sizeSmall': {
        width: props => (props.mobile ? 92 : 180),
      },
      '& .MuiButton-label': {
        color: props => (props.mobile && props.color === 'secondary' ? '#404040' : 'inherit'),
      },
      '& .MuiButton-startIcon': {
        color: props => (props.mobile ? '#FFD24D' : '#404040'),
      },
    },
  }),
);
