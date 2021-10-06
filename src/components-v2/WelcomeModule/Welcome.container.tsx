import React from 'react';
import {useCookies} from 'react-cookie';
import {useSelector, useDispatch} from 'react-redux';

import {useRouter} from 'next/router';

import {WelcomeModule} from './WelcomeModule';

import {RootState} from 'src/reducers';
import {updateUser} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

type WelcomeProps = {
  enabled?: boolean;
};

export const WelcomeContainer: React.FC<WelcomeProps> = props => {
  const [, setCookie] = useCookies(['welcome']);
  const dispatch = useDispatch();
  const router = useRouter();

  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const disbleWelcome = () => {
    setCookie('welcome', {
      enabled: false,
    });
  };

  const handleSubmit = (displayname: string, username: string) => {
    disbleWelcome();

    dispatch(
      updateUser({
        name: displayname,
        username,
      }),
    );

    router.push('/home');
  };

  const handleSkip = () => {
    router.push('/home');
  };

  if (!user) return null;

  return (
    <WelcomeModule
      displayName={user.name}
      username={user.username || ''}
      onSkip={handleSkip}
      onSubmit={handleSubmit}
    />
  );
};
