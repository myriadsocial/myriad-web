import {EyeOffIcon} from '@heroicons/react/outline';

import React from 'react';

import {Button, Typography} from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';

import {useStyles} from './nsfw.style';

type Props = {
  viewContent: () => void;
};
export const NSFW: React.FC<Props> = props => {
  const {viewContent} = props;
  const style = useStyles();

  const handleClick = () => {
    viewContent();
  };

  return (
    <div className={style.root}>
      <SvgIcon
        className={style.icon}
        classes={{root: style.fill}}
        component={EyeOffIcon}
        viewBox="0 0 24 24"
      />
      <Typography variant="h4" className={style.title} component="p">
        NSFW Content
      </Typography>
      <Typography variant="body1" className={style.subTitle} component="p">
        this post may contain sensitive content
      </Typography>
      <Button onClick={handleClick} size="small" color="primary" variant="contained">
        View content
      </Button>
    </div>
  );
};
