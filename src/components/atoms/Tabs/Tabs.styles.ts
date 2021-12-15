import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {TabPosition, TabMark, TabSize} from '../TabList';

type StylesProps = {
  position: TabPosition;
  mark: TabMark;
  size: TabSize;
};

export const useStyles = makeStyles<Theme, StylesProps>(theme =>
  createStyles({
    root: {},
    tabs: {
      borderBottom: '1px solid #E5E5E5',
    },
  }),
);
