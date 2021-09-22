import Badge from '@material-ui/core/Badge';
import {Theme, withStyles, createStyles} from '@material-ui/core/styles';

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: 10,
      top: 40,
      width: 20,
      height: 20,
      border: `1px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
      overflow: 'hidden',
    },
  }),
)(Badge);

export default StyledBadge;
