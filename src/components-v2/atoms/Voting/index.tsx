import {ArrowCircleDownIcon} from '@heroicons/react/outline';
import {ArrowCircleUpIcon} from '@heroicons/react/outline';

import React from 'react';

import {Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';

import {VoteProps} from './voting.interface';
import {useStyles} from './voting.style';

import {debounce} from 'lodash';
import millify from 'millify';

export const VotingComponent: React.FC<VoteProps> = props => {
  const {
    vote,
    variant = 'row',
    size = 'medium',
    onDownVote,
    onUpvote,
    isDownVote,
    isUpVote,
  } = props;
  const style = useStyles({variant, size});

  const handleUpVote = debounce(() => {
    onUpvote();
  }, 300);

  const handleDownVote = debounce(() => {
    onDownVote();
  }, 300);

  const formatNumber = (num: number) => {
    const vote = millify(num, {
      precision: 1,
      lowercase: true,
    });
    return vote;
  };

  const formatNumber = (num: number) => {
    const vote = millify(num, {
      precision: 1,
      lowercase: true,
    });
    return vote;
  };

  return (
    <div className={style.root}>
      <div className={style.icon}>
        <IconButton
          onClick={handleUpVote}
          color={isUpVote ? 'primary' : 'default'}
          className={`${style.action} ${style.mr1}`}>
          <SvgIcon classes={{root: style.fill}} component={ArrowCircleUpIcon} viewBox="0 0 24 24" />
        </IconButton>
        <Typography variant="caption" component="span" className={style.mr1}>
          {formatNumber(vote)}
        </Typography>
        <IconButton
          onClick={handleDownVote}
          className={`${style.action} ${isDownVote ? style.red : style.default}`}>
          <SvgIcon
            classes={{root: style.fill}}
            component={ArrowCircleDownIcon}
            viewBox="0 0 24 24"
          />
        </IconButton>
      </div>
    </div>
  );
};
