import { Theme, withStyles, createStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: 40,
      top: 24,
      width: 28,
      height: 28,
      border: `1px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
      backgroundColor: '#3b5998'
    }
  })
)(Badge);

export default StyledBadge;
