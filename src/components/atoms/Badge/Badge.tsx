import BaseBadge from '@material-ui/core/Badge';
import {Theme, withStyles, createStyles} from '@material-ui/core/styles';

export const Badge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: 10,
      top: 38,
      width: 20,
      height: 20,
      border: `1px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
      overflow: 'hidden',
    },
  }),
)(BaseBadge);
