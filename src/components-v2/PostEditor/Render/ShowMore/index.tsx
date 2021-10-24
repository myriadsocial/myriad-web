import * as React from 'react';

import {Typography} from '@material-ui/core';

export const ELEMENT_SHOW_MORE = 'show_more';

type ShowMoreProps = {
  onClick: () => void;
};

export const ShowMore = (props: ShowMoreProps) => {
  const {onClick} = props;

  return (
    <Typography onClick={onClick} component="span" color="textPrimary">
      ...&nbsp; <span style={{color: '#7342CC', cursor: 'hand'}}>See More</span>
    </Typography>
  );
};
