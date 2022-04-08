import React from 'react';
import {useSelector} from 'react-redux';

import {useWalletList} from '../Manage/use-wallet-list.hook';
import {UserSettings} from './UserSettings';

import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {ProfileState} from 'src/reducers/profile/reducer';

type UserSettingsContainerProps = {
  user?: User;
};

export const UserSettingsContainer: React.FC<UserSettingsContainerProps> = props => {
  const {openToasterSnack} = useToasterSnackHook();

  const {detail} = useSelector<RootState, ProfileState>(state => state.profileState);
  const {walletList} = useWalletList(detail?.wallets ?? []);

  const handlePublicKeyCopied = () => {
    openToasterSnack({
      message: 'Wallet address copied!',
      variant: 'success',
    });
  };

  return (
    <>
      <UserSettings
        wallets={walletList.filter(wallet => wallet.isConnect)}
        onPublicKeyCopied={handlePublicKeyCopied}
      />
    </>
  );
};
