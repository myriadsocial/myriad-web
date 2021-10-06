import React from 'react';

import {UserSettings} from './UserSettings';

import {useToasterHook} from 'src/hooks/use-toaster.hook';
import {Status} from 'src/interfaces/toaster';
import {User} from 'src/interfaces/user';

type UserSettingsContainerProps = {
  user: User;
};

export const UserSettingsContainer: React.FC<UserSettingsContainerProps> = props => {
  const {user} = props;

  const {openToaster} = useToasterHook();

  const handlePublicKeyCopied = () => {
    openToaster({
      message: 'Public key copied!',
      toasterStatus: Status.SUCCESS,
    });
  };

  return (
    <>
      <UserSettings user={user} onPublicKeyCopied={handlePublicKeyCopied} />
    </>
  );
};
