import React from 'react';

import Typography from '@material-ui/core/Typography';

import {useStyles, HeaderWithActionProps} from '.';

export const HeaderWithAction: React.FC<HeaderWithActionProps> = props => {
  const {actionText, onClick} = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography
        variant={'caption'}
        color={'primary'}
        className={classes.actionText}
        onClick={onClick}>
        {actionText}
      </Typography>
    </div>
  );
};
