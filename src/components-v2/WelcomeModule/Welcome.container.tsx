import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useRouter} from 'next/router';

import {Button} from '@material-ui/core';

import {PromptComponent} from '../atoms/Prompt/prompt.component';
import {WelcomeModule} from './WelcomeModule';

import {useProfileHook} from 'src/components/profile/use-profile.hook';
import {Status} from 'src/interfaces/toaster';
import {RootState} from 'src/reducers';
import {showToaster} from 'src/reducers/toaster/actions';
import {updateUser} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

type WelcomeProps = {
  enabled?: boolean;
};

export const WelcomeContainer: React.FC<WelcomeProps> = props => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {usernameAvailable, checkUsernameAvailable} = useProfileHook();

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [skip, setSkip] = useState(false);

  const openSkipConfirmation = () => {
    setSkip(true);
  };

  const closeSkipConfirmation = (): void => {
    setSkip(false);
  };

  const confirmSkip = () => {
    router.push('/home');
  };

  const handleUsernameAvailable = (username: string): void => {
    checkUsernameAvailable(username);
  };

  const handleSubmit = (displayname: string, username: string) => {
    dispatch(
      updateUser(
        {
          name: displayname,
          username,
        },
        () => {
          dispatch(
            showToaster({
              message: 'Success update profile',
              toasterStatus: Status.SUCCESS,
            }),
          );
        },
      ),
    );

    router.push('/home');
  };

  if (!user) return null;

  return (
    <>
      <WelcomeModule
        displayName={user.name}
        username={user.username || ''}
        onSkip={openSkipConfirmation}
        onSubmit={handleSubmit}
        isAvailable={usernameAvailable}
        checkAvailable={handleUsernameAvailable}
      />

      <PromptComponent
        title={'Are you sure?'}
        subtitle={`Are You really want to skip this process?
        and create username latter? `}
        open={skip}
        icon="warning"
        onCancel={closeSkipConfirmation}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            style={{marginRight: '24px'}}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={closeSkipConfirmation}>
            No, let me rethink
          </Button>
          <Button size="small" variant="contained" color="primary" onClick={confirmSkip}>
            Yes, Let’s go
          </Button>
        </div>
      </PromptComponent>
    </>
  );
};
