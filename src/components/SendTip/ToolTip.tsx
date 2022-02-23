import Tooltip from '@material-ui/core/Tooltip';
import {withStyles} from '@material-ui/core/styles';

export const StyledTooltip = withStyles({
  tooltipPlacementRight: {
    margin: '50px 0px 0px -1.5px',
  },
})(Tooltip);
