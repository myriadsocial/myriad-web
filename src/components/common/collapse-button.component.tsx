import React, {useEffect} from 'react';

import IconButton from '@material-ui/core/IconButton';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import clsx from 'clsx';

interface Props {
  onClick: (expanded: boolean) => void;
  defaultExpanded?: boolean;
  className?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginLeft: 'auto',
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      padding: theme.spacing(1),
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
  }),
);

export const ToggleCollapseButton = ({className, defaultExpanded = false, onClick}: Props) => {
  const styles = useStyles();

  const [expanded, setExpanded] = React.useState(defaultExpanded);

  useEffect(() => {
    setExpanded(defaultExpanded);
  }, [defaultExpanded]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
    onClick(!expanded);
  };

  return (
    <div className={[className || '', styles.root].join(' ')}>
      <IconButton
        className={clsx(styles.expand, {
          [styles.expandOpen]: expanded,
        })}
        onClick={handleExpandClick}
        aria-expanded={expanded}
        aria-label="show more">
        <ExpandMoreIcon />
      </IconButton>
    </div>
  );
};
