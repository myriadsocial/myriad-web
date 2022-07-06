import {ArrowCircleDownIcon} from '@heroicons/react/outline';
import {ArrowCircleUpIcon} from '@heroicons/react/outline';

import React from 'react';
import {useSelector} from 'react-redux';

import BaseIconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {VoteProps} from './voting.interface';
import {useStyles} from './voting.style';

import {WithAuthorizeAction} from 'components/common/Authorization/WithAuthorizeAction';
import debounce from 'lodash/debounce';
import {PromptComponent} from 'src/components/Mobile/PromptDrawer/Prompt';
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

  const handleCancel = () => {
    setOpenPromptDrawer(false);
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
      <PromptComponent
        title={'Vote'}
        subtitle={'You can upvote or downvote on posts and comment.'}
        open={openPromptDrawer}
        onCancel={handleCancel}
      />
    </div>
  );
};
