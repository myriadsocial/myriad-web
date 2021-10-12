import React from 'react';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import {fade, Theme, withStyles, createStyles} from '@material-ui/core/styles';

interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

export const StyledTabs = withStyles((theme: Theme) =>
  createStyles({
    indicator: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    root: {
      position: 'relative',
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  }),
)((props: StyledTabsProps) => <Tabs {...props} TabIndicatorProps={{children: <span />}} />);

interface StyledTabProps {
  label: string;
  ariaLabel?: string;
}

export const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      color: '#4b4851',
      fontWeight: 'bold',
      fontSize: 18,
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(2),
      borderRadius: 8,
      '&:focus': {
        opacity: 1,
        backgroundColor: fade('#8629e9', 0.2),
        color: '#8629e9',
      },
    },
  }),
)((props: StyledTabProps) => <Tab aria-label={props.ariaLabel} disableRipple {...props} />);
