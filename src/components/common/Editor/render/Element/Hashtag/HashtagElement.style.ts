import {createStyles, makeStyles, Theme, alpha} from '@material-ui/core/styles';

type HashtagStyleProps = {
  focused?: boolean;
  selected?: boolean;
};
export const useStyles = makeStyles<Theme, HashtagStyleProps>(theme =>
  createStyles({
    root: {
      color: theme.palette.primary.main,
      fontWeight: 600,
      // to separate element & text
      paddingRight: 1,
      background: props => (props.selected ? alpha(theme.palette.secondary.main, 0.3) : 'none'),
      userSelect: 'auto',
      cursor: 'pointer',
    },
  }),
);
