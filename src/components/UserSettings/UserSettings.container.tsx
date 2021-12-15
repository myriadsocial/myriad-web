import React from 'react';

import {UserSettings} from './UserSettings';

import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {User} from 'src/interfaces/user';

type UserSettingsContainerProps = {
  user: User;
};

export const UserSettingsContainer: React.FC<UserSettingsContainerProps> = props => {
  const {user} = props;

  const {openToasterSnack} = useToasterSnackHook();

  const handlePublicKeyCopied = () => {
    openToasterSnack({
      message: 'Public key copied!',
      variant: 'success',
    });
  };

  return (
    <>
      <UserSettings user={user} onPublicKeyCopied={handlePublicKeyCopied} />
    </>
  );
};
