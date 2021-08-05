import React from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      background: 'transparent',
    },
    icon: {
      marginRight: theme.spacing(1),
    },
    toolbar: {
      padding: '0 12px',
    },
    title: {
      flexGrow: 1,
    },
  }),
);

type Props = {
  children: React.ReactNode;
  title: string;
  isDisabled?: boolean;
  expanded?: boolean;
  actions?: React.ReactElement;
  startIcon?: React.ReactElement;
};

export default function ExpandablePanel({
  children,
  title,
  expanded = false,
  actions,
  startIcon,
  isDisabled,
}: Props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion defaultExpanded={expanded} disabled={isDisabled}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-label="Expand"
          aria-controls="additional-actions1-content"
          id="additional-actions1-header">
          {startIcon && <div className={classes.icon}>{startIcon}</div>}
          <Typography variant="h4" className={classes.title}>
            {title}
          </Typography>
          {actions && <>{actions}</>}
        </AccordionSummary>
        {children}
      </Accordion>
    </div>
  );
}
