import React from 'react';

import Box from '@material-ui/core/Box';
import {createStyles, makeStyles} from '@material-ui/core/styles';

type TabPanelProps = {
  value: string | number;
  index: string | number;
  children: React.ReactNode;
  optionalPadding?: number;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {},
  }),
);

export const TabPanel: React.FC<TabPanelProps> = props => {
  const styles = useStyles();
  const {children, value, index, optionalPadding = 3} = props;

  return (
    <div className={styles.root} hidden={value !== index} role="tabpanel">
      {value === index && <Box p={optionalPadding}>{children}</Box>}
    </div>
  );
};
