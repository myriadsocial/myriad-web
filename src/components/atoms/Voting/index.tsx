import { ArrowCircleDownIcon } from '@heroicons/react/outline';
import { ArrowCircleUpIcon } from '@heroicons/react/outline';

import React from 'react';
import { useCookies } from 'react-cookie';
import { shallowEqual, useSelector } from 'react-redux';

import { useRouter } from 'next/router';

import BaseIconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import { VoteProps } from './voting.interface';
import { useStyles } from './voting.style';

import { COOKIE_INSTANCE_URL } from 'components/SelectServer';
import { WithAuthorizeAction } from 'components/common/Authorization/WithAuthorizeAction';
import useConfirm from 'components/common/Confirm/use-confirm.hook';
import debounce from 'lodash/debounce';
import { formatCount } from 'src/helpers/number';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';

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
  const router = useRouter();
  const confirm = useConfirm();

  const anonymous = useSelector<RootState, boolean>(
    state => state.userState.anonymous,
    shallowEqual,
  );

  const style = useStyles({ variant, size });

  const handleUpVote = debounce(() => {
    if (anonymous) {
      openVoteAlert('upvote');
    } else {
      onUpvote();
    }
  }, 300);

  const handleDownVote = debounce(() => {
    if (anonymous) {
      openVoteAlert('downvote');
    } else {
      onDownVote();
    }
  }, 300);

  const [cookies] = useCookies([COOKIE_INSTANCE_URL]);

  const openVoteAlert = (type: 'upvote' | 'downvote') => {
    type === 'upvote'
      ? confirm({
          icon: 'upvote',
          title: i18n.t('Confirm.Anonymous.Upvote.Title'),
          description: i18n.t('Confirm.Anonymous.Upvote.Desc'),
          confirmationText: i18n.t('General.SignIn'),
          cancellationText: i18n.t('LiteVersion.MaybeLater'),
          onConfirm: () => {
            router.push(`/login?instance=${cookies[COOKIE_INSTANCE_URL]}`);
          },
        })
      : confirm({
          icon: 'downvote',
          title: i18n.t('Confirm.Anonymous.Downvote.Title'),
          description: i18n.t('Confirm.Anonymous.Downvote.Desc'),
          confirmationText: i18n.t('General.SignIn'),
          cancellationText: i18n.t('LiteVersion.MaybeLater'),
          onConfirm: () => {
            router.push(`/login?instance=${cookies[COOKIE_INSTANCE_URL]}`);
          },
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
            classes={{ root: isUpVoted ? style.primary : style.default }}
            component={ArrowCircleUpIcon}
            viewBox="0 0 24 24"
          />
        </IconButton>
        <Typography variant="body1" component="span" className={style.mr1}>
          {formatCount(vote)}
        </Typography>
        <IconButton
          disabled={disabled}
          onClick={handleDownVote}
          className={style.action}>
          <SvgIcon
            classes={{ root: isDownVoted ? style.error : style.default }}
            component={ArrowCircleDownIcon}
            viewBox="0 0 24 24"
          />
        </IconButton>
      </div>
    </div>
  );
};
