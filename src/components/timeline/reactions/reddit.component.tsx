import React from 'react';

import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import { SocialMetric } from 'src/interfaces/post';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginRight: theme.spacing(2),
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

export default function RedditReactionComponent({ metric }: Props) {
  const style = useStyles();

  return (
    <div className={style.root}>
      <IconButton aria-label="upvotes-reddit">
        <ArrowUpwardIcon />
      </IconButton>
      <IconButton aria-label="wow">
        <Chip variant="outlined" size="small" label="20" />
      </IconButton>
      <IconButton aria-label="downvotes-reddit">
        <ArrowDownwardIcon />
      </IconButton>
      <IconButton aria-label="wow">
        <Chip variant="outlined" size="small" label="12" />
      </IconButton>
    </div>
  );
}
