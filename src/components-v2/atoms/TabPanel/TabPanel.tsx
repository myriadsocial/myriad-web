import React from 'react';

import Box from '@material-ui/core/Box';
import {createStyles, makeStyles} from '@material-ui/core/styles';

import ShowIf from '../../../components/common/show-if.component';

type TabPanelProps = {
  value: string | number;
  index: string | number;
  children: React.ReactNode;
  padding?: number;
  background?: string;
  borderRadius?: number;
  paddingLeft?: number;
  paddingRight?: number;
  noBox?: boolean;
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
    paddingLeft = 30,
    paddingRight = 30,
    noBox = false,
  } = props;

  return (
    <div className={styles.root} hidden={value !== index} role="tabpanel">
      {value === index && (
        <>
          <ShowIf condition={!noBox}>
            <Box p={padding} style={{background, borderRadius, paddingLeft, paddingRight}}>
              {children}
            </Box>
          </ShowIf>
          <ShowIf condition={noBox}>{children}</ShowIf>
        </>
      )}
    </div>
  );
};
