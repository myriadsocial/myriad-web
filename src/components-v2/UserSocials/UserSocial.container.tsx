import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {UserSocials} from './UserSocials';

import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {fetchConnectedSocials} from 'src/reducers/profile/actions';
import {ProfileState} from 'src/reducers/profile/reducer';

type UserSocialContainerProps = {
  user?: User;
};

export const UserSocialContainer: React.FC<UserSocialContainerProps> = props => {
  const dispatch = useDispatch();

  const {socials} = useSelector<RootState, ProfileState>(state => state.profileState);

  useEffect(() => {
    dispatch(fetchConnectedSocials());
  }, []);

  return (
    <>
      <UserSocials socials={socials} />
    </>
  );
};
