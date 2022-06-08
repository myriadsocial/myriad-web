import React from 'react';

import {Typography} from '@material-ui/core';

import {useStyles} from './Empty.styles';

export type EmptyProps = {
  title: string;
  subtitle?: string;
  margin?: boolean;
};

export const Empty: React.FC<EmptyProps> = props => {
  const {title, subtitle, children} = props;
  const styles = useStyles({...props});

  return (
    <div className={styles.root}>
      <Typography variant="h4" className={styles.title} component="p">
        {title}
      </Typography>
      <Typography variant="body1" color="textSecondary" component="p">
        {subtitle}
      </Typography>
      {children}
    </div>
  );
};

Empty.defaultProps = {
  margin: true,
};
