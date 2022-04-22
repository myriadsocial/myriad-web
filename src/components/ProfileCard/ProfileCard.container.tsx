import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useSession} from 'next-auth/client';
import {useRouter} from 'next/router';

import {ProfileCard} from './ProfileCard';

import {useAuthHook} from 'src/hooks/auth.hook';
import {useUserHook} from 'src/hooks/use-user.hook';
import {RootState} from 'src/reducers';
import {NotificationState} from 'src/reducers/notification/reducer';
import {clearUser} from 'src/reducers/user/actions';
import {fetchUserWalletAddress, fetchCurrentUserWallets} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

type Props = {
  toggleNotification: () => void;
};

export const ProfileCardContainer: React.FC<Props> = ({toggleNotification}) => {
  const {user, alias, anonymous, currentWallet, wallets, networks} = useSelector<
    RootState,
    UserState
  >(state => state.userState);
  const {total} = useSelector<RootState, NotificationState>(state => state.notificationState);

  const router = useRouter();
  const dispatch = useDispatch();
  const [session] = useSession();

  const {userWalletAddress} = useUserHook();
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
    if (session && currentWallet) {
      logout(currentWallet);
    } else {
      dispatch(clearUser());
      await router.push(`/`);
    }
  };

  const handleShowNotificationList = () => {
    toggleNotification();
  };

  return (
    <ProfileCard
      user={user}
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
