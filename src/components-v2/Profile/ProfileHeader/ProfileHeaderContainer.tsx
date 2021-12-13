import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Typography} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import {ProfileHeaderComponent} from '.';
import {PromptComponent} from '../../atoms/Prompt/prompt.component';

import {SendTipContainer} from 'src/components-v2/SendTip';
import {useTimelineFilter} from 'src/components-v2/Timeline/hooks/use-timeline-filter.hook';
import {Modal} from 'src/components-v2/atoms/Modal';
import {useFriendHook} from 'src/hooks/use-profile-friend.hook';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {useReport} from 'src/hooks/use-report.hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Friend, FriendStatus} from 'src/interfaces/friend';
import {ReportProps} from 'src/interfaces/report';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {blockedFriendList} from 'src/reducers/friend/actions';
import {fetchProfileExperience} from 'src/reducers/profile/actions';
import {ProfileState} from 'src/reducers/profile/reducer';
import {UserState} from 'src/reducers/user/reducer';
import {setTippedUserId, setTippedUser as setDetailTippedUser} from 'src/reducers/wallet/actions';
import {WalletState} from 'src/reducers/wallet/reducer';

type Props = {
  edit?: () => void;
};

export const ProfileHeaderContainer: React.FC<Props> = ({edit}) => {
  const {detail: profile, friendStatus} = useSelector<RootState, ProfileState>(
    state => state.profileState,
  );
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const dispatch = useDispatch();

  const {makeFriend, removeFriendRequest, toggleRequest, reloadFriendStatus} = useFriendHook();
  const {sendReportWithAttributes} = useReport();
  const {openToasterSnack} = useToasterSnackHook();
  const {query} = useQueryParams();
  const {filterTimeline} = useTimelineFilter({
    owner: profile?.id,
  });

  const {isTipSent} = useSelector<RootState, WalletState>(state => state.walletState);
  const [tippedUser, setTippedUser] = useState<User | null>(null);
  const [tippedUserForHistory, setTippedUserForHistory] = useState<User | null>(null);
  const [openSuccessPrompt, setOpenSuccessPrompt] = React.useState(false);
  const sendTipOpened = Boolean(tippedUser);

  const urlLink = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  useEffect(() => {
    if (profile) {
      dispatch(fetchProfileExperience());
      filterTimeline(query);
    }
  }, [profile]);

  useEffect(() => {
    if (isTipSent) {
      closeSendTip();
    }
  }, [isTipSent]);

  const sendFriendReqest = () => {
    if (!profile) return;

    makeFriend(profile);
  };

  const declineFriendRequest = () => {
    if (!friendStatus) return;

    removeFriendRequest(friendStatus);
  };

  const handleSendTip = () => {
    if (profile) {
      setTippedUser(profile);

      dispatch(setDetailTippedUser(profile.name, profile.profilePictureURL ?? ''));
      dispatch(setTippedUserId(profile.id));
    }
  };

  const closeSendTip = () => {
    if (isTipSent && tippedUser) {
      //for the future, open tip history here
      setOpenSuccessPrompt(true);
      setTippedUserForHistory(tippedUser);
    } else {
      console.log('no user tipped');
    }
    setTippedUser(null);
  };

  const handleCloseSuccessPrompt = (): void => {
    setOpenSuccessPrompt(false);
  };

  const handleSubmitReport = (payload: ReportProps) => {
    sendReportWithAttributes(payload);
  };

  const handleBlockUser = async () => {
    if (!profile) return;

    if (friendStatus) {
      await toggleRequest(friendStatus, FriendStatus.BLOCKED);
    } else {
      await dispatch(blockedFriendList(profile.id));
      await reloadFriendStatus();
    }

    openToasterSnack({
      message: 'User successfully blocked',
      variant: 'success',
    });
  };

  const handleUnblockUser = (friend: Friend) => {
    toggleRequest(friend, FriendStatus.PENDING);
  };

  const handleAcceptFriend = () => {
    if (friendStatus) {
      toggleRequest(friendStatus, FriendStatus.APPROVED);

      openToasterSnack({
        message: 'Friend request confirmed',
        variant: 'success',
      });
    }
  };

  const handleRemoveFriend = () => {
    if (friendStatus) {
      removeFriendRequest(friendStatus);

      openToasterSnack({
        message: `${profile?.name} has removed from your friend list`,
        variant: 'success',
      });
    }
  };

  if (!user || !profile) return null;

  return (
    <>
      <ProfileHeaderComponent
        person={profile}
        user={user}
        status={friendStatus}
        onSendRequest={sendFriendReqest}
        onDeclineRequest={declineFriendRequest}
        onSendTip={handleSendTip}
        onBlock={handleBlockUser}
        onUnblockFriend={handleUnblockUser}
        onEdit={edit}
        linkUrl={`${urlLink()}/profile/${profile.id}`}
        onSubmitReport={handleSubmitReport}
        onRemoveFriend={handleRemoveFriend}
        onAcceptFriend={handleAcceptFriend}
      />
      <Modal
        gutter="none"
        open={sendTipOpened}
        onClose={closeSendTip}
        title="Send Tip"
        subtitle="Finding this post is insightful? Send a tip!">
        <SendTipContainer />
      </Modal>

      <PromptComponent
        icon={'success'}
        open={openSuccessPrompt}
        onCancel={handleCloseSuccessPrompt}
        title={'Success'}
        subtitle={
          <Typography component="div">
            Tip to{' '}
            <Box fontWeight={700} display="inline">
              {tippedUserForHistory?.name ?? 'Unknown Myrian'}
            </Box>{' '}
            sent successfully
          </Typography>
        }>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleCloseSuccessPrompt}>
            Return
          </Button>
        </div>
      </PromptComponent>
    </>
  );
};
