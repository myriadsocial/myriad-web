import React from 'react';

import {Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import Box, {BoxProps} from '@material-ui/core/Box';
import {makeStyles, Theme} from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

type BoxComponentProps = BoxProps & {
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  radiusStr?: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    background: '#FFF',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
    borderRadius: props => props.radiusStr ?? theme.spacing(2.5),
    padding: theme.spacing(3, 3.75),
  },
  header: {
    marginBottom: 14,
    display: 'flex',
    justifyContent: 'space-between',
  },
  action: {
    padding: 0,
  },
}));

export const BoxComponent: React.FC<BoxComponentProps> = props => {
  const {children, title, ...restProps} = props;
  const styles = useStyles(props);

  return (
    <Box {...restProps} className={styles.root}>
      {title && (
        <div className={styles.header}>
          <Typography variant="h4">{title}</Typography>

          <IconButton color="primary" size="medium" className={styles.action}>
            <ChevronRightIcon fontSize="medium" />
          </IconButton>
        </div>
      )}

      {children}
    </Box>
  );
};
