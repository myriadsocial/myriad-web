import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {ProfileHeaderComponent} from '.';

import {SendTipContainer} from 'src/components-v2/SendTip';
import {useTimelineFilter} from 'src/components-v2/Timeline/hooks/use-timeline-filter.hook';
import {Modal} from 'src/components-v2/atoms/Modal';
import {useFriendHook} from 'src/components/profile/use-profile-friend.hook';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {useReport} from 'src/hooks/use-report.hook';
import {useToasterHook} from 'src/hooks/use-toaster.hook';
import {Friend, FriendStatus} from 'src/interfaces/friend';
import {ReportProps} from 'src/interfaces/report';
import {Status} from 'src/interfaces/toaster';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
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

  const {makeFriend, removeFriendRequest, toggleRequest} = useFriendHook();
  const {sendReportWithAttributes} = useReport();
  const {openToaster} = useToasterHook();
  const {query} = useQueryParams();
  const {filterTimeline} = useTimelineFilter({
    owner: profile?.id,
  });
  const {isTipSent} = useSelector<RootState, WalletState>(state => state.walletState);

  const [tippedUser, setTippedUser] = useState<User | null>(null);
  const sendTipOpened = Boolean(tippedUser);

  const isOwnProfile = profile?.id === user?.id;

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

  if (!user) return null;

  if (!profile) return null;

  const handleSendTip = () => {
    setTippedUser(profile);

    dispatch(setDetailTippedUser(profile.name, profile.profilePictureURL ?? ''));
    dispatch(setTippedUserId(profile.id));
  };

  const closeSendTip = () => {
    if (isTipSent && tippedUser) {
      //for the future, open tip history here
    } else {
      console.log('no user tipped');
    }
    setTippedUser(null);
  };

  const handleSubmitReport = (payload: ReportProps) => {
    sendReportWithAttributes(payload);
  };

  const handleBlockUser = () => {
    if (friendStatus) {
      toggleRequest(friendStatus, FriendStatus.BLOCKED);
      openToaster({
        message: 'User successfully blocked',
        toasterStatus: Status.SUCCESS,
      });
    }
  };

  const handleUnblockUser = (friend: Friend) => {
    toggleRequest(friend, FriendStatus.PENDING);
  };

  return (
    <>
      <ProfileHeaderComponent
        user={profile}
        selfProfile={isOwnProfile}
        status={friendStatus}
        onSendRequest={sendFriendReqest}
        onDeclineRequest={declineFriendRequest}
        onSendTip={handleSendTip}
        onBlock={handleBlockUser}
        onUnblockFriend={handleUnblockUser}
        onEdit={edit}
        linkUrl={`${urlLink()}/profile/${profile.id}`}
        onSubmitReport={handleSubmitReport}
      />
      <Modal
        gutter="none"
        open={sendTipOpened}
        onClose={closeSendTip}
        title="Send Tip"
        subtitle="Finding this post is insightful? Send a tip!">
        <SendTipContainer />
      </Modal>
    </>
  );
};
