import React from 'react';

import {Typography} from '@material-ui/core';

import {useStyles} from './Empty.styles';

type EmptyProps = {
  title: string;
  subtitle: string;
};

export const Empty: React.FC<EmptyProps> = props => {
  const {title, subtitle} = props;
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Typography className={styles.title} component="p">
        {title}
      </Typography>
      <Typography className={styles.subtitle} color="textSecondary" component="p">
        {subtitle}
      </Typography>
    </div>
  );
};
