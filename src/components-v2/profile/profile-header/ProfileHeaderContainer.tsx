import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {ProfileHeaderComponent} from 'src/components-v2/profile/profile-header';
import {useFriendHook} from 'src/components/profile/use-profile-friend.hook';
import {RootState} from 'src/reducers';
import {ProfileState} from 'src/reducers/profile/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const ProfileHeaderContainer: React.FC = () => {
  const {detail: profile} = useSelector<RootState, ProfileState>(state => state.profileState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const {friendStatus} = useFriendHook();
  const [selfProfile, setSelfProfile] = useState<boolean>(false);

  useEffect(() => {
    if (profile && user) setSelfProfile(profile.id === user.id);
  }, [profile?.id]);

  return (
    <>
      {profile && (
        <ProfileHeaderComponent user={profile} selfProfile={selfProfile} status={friendStatus} />
      )}
    </>
  );
};
