import {makeStyles, Theme} from '@material-ui/core/styles';

export const useStylesForTabs = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  padding: {
    padding: theme.spacing(3),
  },
  demo2: {
    backgroundColor: 'transparent',
  },
}));
