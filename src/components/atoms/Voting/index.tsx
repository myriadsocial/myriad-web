import {ArrowCircleDownIcon} from '@heroicons/react/outline';
import {ArrowCircleUpIcon} from '@heroicons/react/outline';

import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';

import BaseIconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {VoteProps} from './voting.interface';
import {useStyles} from './voting.style';

import {WithAuthorizeAction} from 'components/common/Authorization/WithAuthorizeAction';
import useConfirm from 'components/common/Confirm/use-confirm.hook';
import debounce from 'lodash/debounce';
import {formatCount} from 'src/helpers/number';
import {RootState} from 'src/reducers';

const IconButton = WithAuthorizeAction(BaseIconButton);

export const VotingComponent: React.FC<VoteProps> = props => {
  const {
    vote,
    variant = 'row',
    size = 'medium',
    onDownVote,
    onUpvote,
    isDownVoted,
    isUpVoted,
    disabled = false,
  } = props;
  const confirm = useConfirm();

  const anonymous = useSelector<RootState, boolean>(
    state => state.userState.anonymous,
    shallowEqual,
  );

  const style = useStyles({variant, size});

  const handleUpVote = debounce(() => {
    if (anonymous) {
      openVoteAlert();
    } else {
      onUpvote();
    }
  }, 300);

  const handleDownVote = debounce(() => {
    if (anonymous) {
      openVoteAlert();
    } else {
      onDownVote();
    }
  }, 300);

  const openVoteAlert = () => {
    confirm({
      title: 'Vote',
      description: 'You can upvote or downvote on posts and comment.',
      hideCancel: true,
    });
  };

  return (
    <div className={style.root}>
      <div className={style.icon}>
        <IconButton
          disabled={disabled}
          onClick={handleUpVote}
          className={`${style.action} ${style.mr1}`}>
          <SvgIcon
            classes={{root: isUpVoted ? style.primary : style.default}}
            component={ArrowCircleUpIcon}
            viewBox="0 0 24 24"
          />
        </IconButton>
        <Typography variant="body1" component="span" className={style.mr1}>
          {formatCount(vote)}
        </Typography>
        <IconButton disabled={disabled} onClick={handleDownVote} className={style.action}>
          <SvgIcon
            classes={{root: isDownVoted ? style.error : style.default}}
            component={ArrowCircleDownIcon}
            viewBox="0 0 24 24"
          />
        </IconButton>
      </div>
    </div>
  );
};
