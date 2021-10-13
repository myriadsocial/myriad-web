import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {ProfileHeaderComponent} from '.';
import {User} from '../../../interfaces/user';
import {setTippedUserId} from '../../../reducers/wallet/actions';
import {SendTipContainer} from '../../SendTip/';

import {Modal} from 'src/components-v2/atoms/Modal';
import {useFriendHook} from 'src/components/profile/use-profile-friend.hook';
import {RootState} from 'src/reducers';
import {ProfileState} from 'src/reducers/profile/reducer';
import {UserState} from 'src/reducers/user/reducer';

type Props = {
  edit?: () => void;
};

export const ProfileHeaderContainer: React.FC<Props> = ({edit}) => {
  const {
    detail: profile,
    friends: {
      meta: {totalItemCount: totalFriends},
    },
    experience: {
      meta: {totalItemCount: totalExperience},
    },
  } = useSelector<RootState, ProfileState>(state => state.profileState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const dispatch = useDispatch();

  const {friendStatus, makeFriend, checkFriendStatus, removeFriendRequest} = useFriendHook();

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
      checkFriendStatus(profile.id);
    }
  }, [profile]);

  const sendFriendReqest = () => {
    if (!profile) return;

    makeFriend(profile);
  };

  const declineFriendRequest = () => {
    if (!friendStatus) return;

    removeFriendRequest(friendStatus);
  };

  if (!user) return null;

  const closeSendTip = () => {
    setTippedUser(null);
  };

  if (!profile) return null;

  const handleSendTip = () => {
    setTippedUser(profile);
    dispatch(setTippedUserId(profile.id));
  };

  return (
    <>
      <ProfileHeaderComponent
        user={profile}
        selfProfile={isOwnProfile}
        status={friendStatus}
        totalFriends={totalFriends}
        totalExperience={totalExperience}
        onSendRequest={sendFriendReqest}
        onDeclineRequest={declineFriendRequest}
        onSendTip={handleSendTip}
        onEdit={edit}
        linkUrl={`${urlLink()}/profile/${profile.id}`}
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
