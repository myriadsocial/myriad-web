import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {ProfileCard} from './ProfileCard';

import {useAuthHook} from 'src/hooks/auth.hook';
import {useUserHook} from 'src/hooks/use-user.hook';
import {RootState} from 'src/reducers';
import {fetchUserWalletAddress, fetchCurrentUserWallets} from 'src/reducers/user/actions';

type Props = {
  toggleNotification: () => void;
};

export const ProfileCardContainer: React.FC<Props> = ({toggleNotification}) => {
  const total = useSelector<RootState, number>(state => state.notificationState.total);

  const router = useRouter();
  const dispatch = useDispatch();

  const {user, anonymous, alias, currentWallet, wallets, networks, userWalletAddress} =
    useUserHook();
  const {logout} = useAuthHook();

  useEffect(() => {
    dispatch(fetchCurrentUserWallets());
  }, []);

  useEffect(() => {
    if (currentWallet && currentWallet.network?.id) dispatch(fetchUserWalletAddress());
  }, [currentWallet]);

  const handleViewProfile = () => {
    if (user && !anonymous) {
      router.push(`/profile/${user.id}`);
    }
  };

  const handleSignOut = async () => {
    logout(currentWallet);
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
      onShowNotificationList={handleShowNotificationList}
    />
  );
};

export default ProfileCardContainer;
