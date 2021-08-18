import React from 'react';

import Tab from '@material-ui/core/Tab';
import {makeStyles, Theme, createStyles, fade} from '@material-ui/core/styles';

interface StyledTabProps {
  label: string;
  ariaLabel?: string;
}

export const useStylesForTab = makeStyles((theme: Theme) =>
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
);

export const StyledTabComponent = (props: StyledTabProps): JSX.Element => {
  const classes = useStylesForTab();
  return <Tab className={classes.root} aria-label={props.ariaLabel} disableRipple {...props} />;
};
