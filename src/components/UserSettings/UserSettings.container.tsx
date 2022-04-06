import React from 'react';

import {useSession} from 'next-auth/client';

import {UserSettings} from './UserSettings';

import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {User} from 'src/interfaces/user';

type UserSettingsContainerProps = {
  user: User | undefined;
};

export const UserSettingsContainer: React.FC<UserSettingsContainerProps> = props => {
  const [session] = useSession();
  const {openToasterSnack} = useToasterSnackHook();

  const address = session?.user.address as string;

  const handlePublicKeyCopied = () => {
    openToasterSnack({
      message: 'Public key copied!',
      variant: 'success',
    });
  };

  return (
    <>
      <UserSettings publicKey={address} onPublicKeyCopied={handlePublicKeyCopied} />
    </>
  );
};
