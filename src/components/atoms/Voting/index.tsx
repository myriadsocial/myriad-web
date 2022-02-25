import {ArrowCircleDownIcon} from '@heroicons/react/outline';
import {ArrowCircleUpIcon} from '@heroicons/react/outline';

import React from 'react';
import {useSelector} from 'react-redux';

import {Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';

import {VoteProps} from './voting.interface';
import {useStyles} from './voting.style';

import {debounce} from 'lodash';
import millify from 'millify';
import {PromptComponent} from 'src/components/Mobile/PromptDrawer/Prompt';
import {RootState} from 'src/reducers';

export const VotingComponent: React.FC<VoteProps> = props => {
  const {
    vote,
    variant = 'row',
    size = 'medium',
    onDownVote,
    onUpvote,
    isDownVote,
    isUpVote,
    disabled = false,
  } = props;
  const anonymous = useSelector<RootState, boolean>(state => state.userState.anonymous);
  const [openPromptDrawer, setOpenPromptDrawer] = React.useState(false);

  const style = useStyles({variant, size});

  const handleUpVote = debounce(() => {
    if (anonymous) {
      setOpenPromptDrawer(true);
    } else {
      onUpvote();
    }
  }, 300);

  const handleDownVote = debounce(() => {
    if (anonymous) {
      setOpenPromptDrawer(true);
    } else {
      onDownVote();
    }
  }, 300);

  const formatNumber = (num: number) => {
    const vote = millify(num, {
      precision: 1,
      lowercase: true,
    });
    return vote;
  };

  const handleCancel = () => {
    setOpenPromptDrawer(false);
  };

  return (
    <div className={style.root}>
      <div className={style.icon}>
        <IconButton
          disabled={disabled}
          onClick={handleUpVote}
          color={isUpVote ? 'primary' : 'default'}
          className={`${style.action} ${style.mr1}`}>
          <SvgIcon classes={{root: style.fill}} component={ArrowCircleUpIcon} viewBox="0 0 24 24" />
        </IconButton>
        <Typography variant="caption" component="span" className={style.mr1}>
          {formatNumber(vote)}
        </Typography>
        <IconButton
          disabled={disabled}
          onClick={handleDownVote}
          className={`${style.action} ${isDownVote ? style.red : style.default}`}>
          <SvgIcon
            classes={{root: style.fill}}
            component={ArrowCircleDownIcon}
            viewBox="0 0 24 24"
          />
        </IconButton>
      </div>
      <PromptComponent
        title={'Vote'}
        subtitle={'You can upvote or downvote on posts and comment.'}
        open={openPromptDrawer}
        onCancel={handleCancel}
      />
    </div>
  );
};
