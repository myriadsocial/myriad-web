import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {TabPosition, TabMark, TabSize} from '../TabList';

type StylesProps = {
  position?: TabPosition;
  mark: TabMark;
  size: TabSize;
};

export const useStyles = makeStyles<Theme, StylesProps>(theme =>
  createStyles({
    root: {},
    tabs: {
      '& .MuiTabs-flexContainer': {
        justifyContent: props => props.position ?? null,
        gap: props => (props.position === 'left' ? 20 : null),
      },
    },
  }),
);
