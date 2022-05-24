import * as React from 'react';

import {Button, Typography} from '@material-ui/core';

import {useStyles} from './ShowMore.styles';

export const ELEMENT_SHOW_MORE = 'show_more';

type ShowMoreProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export const ShowMore: React.FC<ShowMoreProps> = props => {
  const {onClick} = props;
  const styles = useStyles();

  return (
    <Typography component="span" color="textPrimary">
      ...&nbsp;
      <Button onClick={onClick} className={styles.button} disableTouchRipple>
        See More
      </Button>
    </Typography>
  );
};
