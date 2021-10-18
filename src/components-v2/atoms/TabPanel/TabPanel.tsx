import React from 'react';

import Box from '@material-ui/core/Box';
import {createStyles, makeStyles} from '@material-ui/core/styles';

type TabPanelProps = {
  value: string | number;
  index: string | number;
  children: React.ReactNode;
  padding?: number;
  background?: string;
  borderRadius?: number;
  paddingLeft?: number;
  paddingRight?: number;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {},
  }),
);

export const TabPanel: React.FC<TabPanelProps> = props => {
  const styles = useStyles();
  const {
    children,
    value,
    index,
    padding = 3,
    background = 'none',
    borderRadius = 0,
    paddingLeft = 0,
    paddingRight = 0,
  } = props;

  return (
    <div className={styles.root} hidden={value !== index} role="tabpanel">
      {index === 'posts-tab' && <>{children}</>}
      {index !== 'posts-tab' && value === index && (
        <>
          <Box p={padding} style={{background, borderRadius, paddingLeft, paddingRight}}>
            {children}
          </Box>
        </>
      )}
    </div>
  );
};
