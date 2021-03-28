import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme, lighten } from '@material-ui/core/styles';

import LikeIcon from 'src/images/twitter/like.svg';
import RetweetIcon from 'src/images/twitter/retweet.svg';
import { SocialMetric } from 'src/interfaces/post';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginRight: theme.spacing(2),
      '& > *': {
        margin: 0,
        padding: 0
      }
    },
    wrapper: {
      paddingRight: theme.spacing(2),
      textAlign: 'center'
    },
    icon: {
      height: 20,
      fill: lighten('#AAB8C2', 0.3)
    }
  })
);

type Props = {
  metric: SocialMetric;
};

export default function TwitterReactionComponent({ metric }: Props) {
  const style = useStyles();

  return (
    <div className={style.root}>
      <IconButton aria-label="retweet" className={style.wrapper} disableRipple={true} disableFocusRipple={true}>
        <RetweetIcon className={style.icon} />
        <Typography variant="subtitle1">{metric.retweet}</Typography>
      </IconButton>

      <IconButton aria-label="like" className={style.wrapper} disableRipple disableFocusRipple>
        <LikeIcon className={style.icon} />
        <Typography variant="subtitle1">{metric.like}</Typography>
      </IconButton>
    </div>
  );
}
