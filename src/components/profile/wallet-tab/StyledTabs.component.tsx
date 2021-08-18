import React from 'react';

import Tabs from '@material-ui/core/Tabs';
import {styled} from '@material-ui/core/styles';

interface StyledTabsProps {
  value: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
  ariaLabel?: string;
  children: React.ReactNode;
}

const StyledTabs = styled(Tabs)({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

export const StyledTabsComponent = (props: StyledTabsProps): JSX.Element => {
  return (
    <StyledTabs
      variant="fullWidth"
      {...props}
      aria-label={props.ariaLabel}
      TabIndicatorProps={{children: <span />}}
    />
  );
};
