import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {ProfileHeaderComponent} from '.';

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

  const {friendStatus, makeFriend, checkFriendStatus, removeFriendRequest} = useFriendHook();
  const isOwnProfile = profile?.id === user?.id;

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

  const handleSendTip = () => {
    // code
  };

  if (!profile) return null;

  return (
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
    />
  );
};
