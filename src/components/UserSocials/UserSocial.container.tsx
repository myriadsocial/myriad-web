import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {UserSocials} from './UserSocials';

import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';
import {fetchProfileSocials} from 'src/reducers/profile/actions';
import {ProfileState} from 'src/reducers/profile/reducer';
import {UserState} from 'src/reducers/user/reducer';

type UserSocialContainerProps = {
  user?: User;
};

export const UserSocialContainer: React.FC<UserSocialContainerProps> = props => {
  const dispatch = useDispatch();

  const {socials, detail, friendStatus} = useSelector<RootState, ProfileState>(
    state => state.profileState,
  );
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);

  useEffect(() => {
    dispatch(fetchProfileSocials(user?.id === detail?.id));
  }, [user, detail]);

  return (
    <>
      <UserSocials
        socials={socials}
        isPrivate={settings.privacy.socialMediaPrivacy == 'private'}
        isFriend={friendStatus?.status == 'approved'}
        isOwner={detail?.id == user?.id}
      />
    </>
  );
};
