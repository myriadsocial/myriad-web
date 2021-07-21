import Badge from '@material-ui/core/Badge';
import {Theme, withStyles, createStyles} from '@material-ui/core/styles';

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: 32,
      top: 22,
      width: 22,
      height: 22,
      border: `1px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }),
)(Badge);

export default StyledBadge;
