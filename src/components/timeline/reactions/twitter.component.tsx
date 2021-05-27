import React from 'react';

import Button from '@material-ui/core/Button';
import SvgIcon from '@material-ui/core/SvgIcon';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';

import RetweetIcon from 'src/images/twitter/retweet.svg';
import { SocialMetric } from 'src/interfaces/post';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginRight: theme.spacing(0),
      '& > *': {
        margin: 0,
        padding: 0
      }
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
      <Button
        aria-label="retweet"
        startIcon={
          <SvgIcon>
            <RetweetIcon />
          </SvgIcon>
        }
        disableFocusRipple>
        {metric.retweet}
      </Button>
      <Button aria-label="like" startIcon={<FavoriteIcon />} disableFocusRipple>
        {metric.like}
      </Button>
    </div>
  );
}
