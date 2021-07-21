import React from 'react';

import Tabs from '@material-ui/core/Tabs';
<<<<<<< HEAD
import {withStyles} from '@material-ui/core/styles';
=======
import {makeStyles, createStyles} from '@material-ui/core/styles';
>>>>>>> 68bf2eb (MYR-287: Added Children Props - added children as props)

interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
  children?: React.ReactNode;
}

<<<<<<< HEAD
export const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
})((props: StyledTabsProps) => <Tabs {...props} TabIndicatorProps={{children: <span />}} />);
=======
const StyledTabsComponent = ({value, onChange, children}: StyledTabsProps) => {
  return (
    <Tabs
      value={value}
      onChange={onChange}
      TabIndicatorProps={{
        style: {
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        },
      }}>
      {children}
    </Tabs>
  );
};

export default StyledTabsComponent;
>>>>>>> 68bf2eb (MYR-287: Added Children Props - added children as props)
