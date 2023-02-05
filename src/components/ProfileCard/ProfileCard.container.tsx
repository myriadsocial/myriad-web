import React from 'react';
import {useCookies} from 'react-cookie';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {ProfileCard} from './ProfileCard';

import {COOKIE_INSTANCE_URL} from 'components/SelectServer';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useUserHook} from 'src/hooks/use-user.hook';
import {RootState} from 'src/reducers';

type Props = {
  toggleNotification: () => void;
};

export const ProfileCardContainer: React.FC<Props> = ({toggleNotification}) => {
  const total = useSelector<RootState, number>(state => state.notificationState.total);

  const router = useRouter();

  const [cookies] = useCookies([COOKIE_INSTANCE_URL]);

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
    await logout(`/?rpc=${cookies[COOKIE_INSTANCE_URL]}`);
  };

  const handleLoginOrCreateAccount = () => {
    router.push({pathname: '/login', query: {rpc: cookies[COOKIE_INSTANCE_URL]}});
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
