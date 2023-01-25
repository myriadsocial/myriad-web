import React from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {ProfileCard} from './ProfileCard';

import {useAuthHook} from 'src/hooks/auth.hook';
import {useUserHook} from 'src/hooks/use-user.hook';
import {RootState} from 'src/reducers';

type Props = {
  toggleNotification: () => void;
};

export const ProfileCardContainer: React.FC<Props> = ({toggleNotification}) => {
  const total = useSelector<RootState, number>(state => state.notificationState.total);

  const router = useRouter();

  const {user, anonymous, alias, currentWallet, wallets, networks, userWalletAddress} =
    useUserHook();
  const {logout} = useAuthHook();

  const handleViewProfile = () => {
    if (user && !anonymous) {
      router.push(`/profile/${user.id}`);
    }
  };

  const handleConnectWeb3Wallet = () => {
    router.push(`/wallet?type=manage`);
  };

  const handleSignOut = async () => {
    await logout();
    // router.push('/');
    router.replace('/friends');
    router.reload();
  };

  const handleLoginOrCreateAccount = () => {
    router.push('/login');
  };

  const handleShowNotificationList = () => {
    toggleNotification();
  };

  return (
    <ProfileCard
      user={user}
      anonymous={anonymous}
      userWalletAddress={userWalletAddress}
      currentWallet={currentWallet}
      wallets={wallets}
      networks={networks}
      alias={alias}
      notificationCount={total}
      onViewProfile={handleViewProfile}
      handleSignOut={handleSignOut}
      handleLoginOrCreateAccount={handleLoginOrCreateAccount}
      onShowNotificationList={handleShowNotificationList}
      handleConnectWeb3Wallet={handleConnectWeb3Wallet}
    />
  );
};

export default ProfileCardContainer;
