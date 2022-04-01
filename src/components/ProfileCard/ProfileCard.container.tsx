import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useSession} from 'next-auth/client';
import {useRouter} from 'next/router';

import {Button, Typography} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {PolkadotAccountList} from '../PolkadotAccountList';
import {PolkadotLink} from '../common/PolkadotLink.component';
import {ProfileCard} from './ProfileCard';

import {useAuthHook} from 'src/hooks/auth.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {toHexPublicKey} from 'src/lib/crypto';
import {RootState} from 'src/reducers';
import {NotificationState} from 'src/reducers/notification/reducer';
import {clearUser} from 'src/reducers/user/actions';
import {fetchCurrentUserWallets} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';
import {Prompt} from 'src/stories/Prompt.stories';

type Props = {
  toggleNotification: () => void;
};

export const ProfileCardContainer: React.FC<Props> = ({toggleNotification}) => {
  const {user, alias, anonymous, currentWallet} = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const {total} = useSelector<RootState, NotificationState>(state => state.notificationState);

  const router = useRouter();
  const dispatch = useDispatch();
  const [session] = useSession();

  const {enablePolkadotExtension} = usePolkadotExtension();
  const {logout, switchAccount, getRegisteredAccounts} = useAuthHook();

  const [showAccountList, setShowAccountList] = useState(false);
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);

  React.useEffect(() => {
    dispatch(fetchCurrentUserWallets());
  }, []);

  const checkExtensionInstalled = async () => {
    const installed = await enablePolkadotExtension();

    setShowAccountList(true);
    setExtensionInstalled(installed);

    getAvailableAccounts();
  };

  const getAvailableAccounts = async () => {
    const accounts = await getRegisteredAccounts();

    setAccounts(accounts.filter(account => toHexPublicKey(account) !== user?.id));
  };

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

  const handleSwitchAccount = () => {
    checkExtensionInstalled();
  };

  const closeAccountList = () => {
    setShowAccountList(false);
  };

  const handleShowNotificationList = () => {
    toggleNotification();
  };

  return (
    <>
      <ProfileCard
        user={user}
        currentWallet={currentWallet}
        alias={alias}
        notificationCount={total}
        onViewProfile={handleViewProfile}
        onSwitchAccount={handleSwitchAccount}
        handleSignOut={handleSignOut}
        onShowNotificationList={handleShowNotificationList}
      />

      <PolkadotAccountList
        isOpen={showAccountList && extensionInstalled}
        accounts={accounts}
        onSelect={switchAccount}
        onClose={closeAccountList}
      />

      <Prompt
        title="Account Not Found"
        icon="warning"
        open={showAccountList && !extensionInstalled}
        onCancel={closeAccountList}
        subtitle={
          <Typography>
            Kindly check if you have&nbsp;
            <PolkadotLink />
            &nbsp;installed on your browser
          </Typography>
        }>
        <Button size="small" variant="contained" color="primary" onClick={closeAccountList}>
          Close
        </Button>
      </Prompt>
    </>
  );
};

export default ProfileCardContainer;
