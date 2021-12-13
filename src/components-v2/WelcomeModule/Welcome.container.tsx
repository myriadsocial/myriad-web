import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useRouter} from 'next/router';

import {Button} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import {PromptComponent} from '../atoms/Prompt/prompt.component';
import {WelcomeModule} from './WelcomeModule';

import {useProfileHook} from 'src/hooks/use-profile.hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {skipUsername} from 'src/lib/api/activity';
import {RootState} from 'src/reducers';
import {updateUser} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

type WelcomeProps = {
  enabled?: boolean;
};

export const WelcomeContainer: React.FC<WelcomeProps> = props => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {usernameAvailable, checkUsernameAvailable} = useProfileHook();
  const {openToasterSnack} = useToasterSnackHook();

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [skip, setSkip] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');

  const openSkipConfirmation = () => {
    setSkip(true);
  };

  const closeSkipConfirmation = (): void => {
    setSkip(false);
  };

  const confirmSkip = async () => {
    if (user) {
      await skipUsername(user);
    }

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
          openToasterSnack({
            message: 'Success update profile',
            variant: 'success',
          });
        },
      ),
    );

    router.push('/home');
  };

  const handleConfirmation = (displayname: string, username: string) => {
    setName(displayname);
    setUsername(username);
    setConfirmation(!confirmation);
  };

  const closeConfirmation = () => {
    setConfirmation(!confirmation);
  };

  if (!user) return null;

  return (
    <>
      <WelcomeModule
        displayName={user.name}
        username={user.username || ''}
        onSkip={openSkipConfirmation}
        onSubmit={handleConfirmation}
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
            style={{marginRight: '12px'}}
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

      <PromptComponent
        title={'Are you sure?'}
        subtitle={
          <Typography>
            Your username&nbsp;
            <Typography component="span" color="primary" style={{fontWeight: 600}}>
              @{username}
            </Typography>
            &nbsp;and&nbsp;
            <Typography component="span" color="error" style={{fontWeight: 600}}>
              cannot be change later
            </Typography>
            . are you really want to use it?
          </Typography>
        }
        open={confirmation}
        icon="warning"
        onCancel={closeConfirmation}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            style={{marginRight: '12px'}}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={closeConfirmation}>
            No, let me rethink
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleSubmit(name, username)}>
            Yes, Let’s go
          </Button>
        </div>
      </PromptComponent>
    </>
  );
};
