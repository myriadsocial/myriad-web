import React from 'react';
import {useSelector} from 'react-redux';

import {useWalletList} from '../Manage/use-wallet-list.hook';
import {UserSettings} from './UserSettings';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {ProfileState} from 'src/reducers/profile/reducer';

type UserSettingsContainerProps = {
  user?: User;
};

export const UserSettingsContainer: React.FC<UserSettingsContainerProps> = props => {
  const enqueueSnackbar = useEnqueueSnackbar();

  const {detail} = useSelector<RootState, ProfileState>(state => state.profileState);
  const {walletList} = useWalletList(detail?.wallets ?? []);

  const handlePublicKeyCopied = () => {
    enqueueSnackbar({
      message: i18n.t('Profile.Setting.Copy'),
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
