import React from 'react';

import Tab from '@material-ui/core/Tab';
import {fade, withStyles, createStyles} from '@material-ui/core/styles';

interface StyledTabProps {
  label: string;
  ariaLabel?: string;
  id: string;
  key: string;
}

export const StyledTab = withStyles(() =>
  createStyles({
    root: {
      textTransform: 'none',
      color: '#4b4851',
      fontWeight: 'bold',
      fontSize: 18,
      borderRadius: 8,
      minWidth: 74,
      minHeight: 36,
      marginTop: 24,
      '&:focus': {
        opacity: 1,
        backgroundColor: fade('#8629e9', 0.2),
        color: '#8629e9',
      },
    },
  }),
)((props: StyledTabProps) => (
  <Tab
    aria-label={props.ariaLabel}
    disableRipple
    {...props}
    label={props.label}
    id={props.id}
    key={props.key}
  />
));
