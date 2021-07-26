import React from 'react';

import Tabs from '@material-ui/core/Tabs';

interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
  children?: React.ReactNode;
}

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
