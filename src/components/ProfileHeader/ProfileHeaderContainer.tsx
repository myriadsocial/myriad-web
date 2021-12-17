import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import {signOut} from 'next-auth/client';
import {useRouter} from 'next/router';

import {Button, Link, Typography} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {ProfileHeader as ProfileHeaderComponent} from '.';
import {PolkadotAccountList} from '../PolkadotAccountList';

import {useAuthHook} from 'src/hooks/auth.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {RootState} from 'src/reducers';
import {NotificationState} from 'src/reducers/notification/reducer';
import {UserState} from 'src/reducers/user/reducer';
import {Prompt} from 'src/stories/Prompt.stories';

type Props = {
  toggleNotification: () => void;
};

export const ProfileHeaderContainer: React.FC<Props> = ({toggleNotification}) => {
  const {user, alias, anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const {total} = useSelector<RootState, NotificationState>(state => state.notificationState);

  const router = useRouter();

  const {enablePolkadotExtension} = usePolkadotExtension();
  const {logout, signInWithAccount, getRegisteredAccounts} = useAuthHook();

  const [accountListOpen, setAccountListOpen] = useState(false);
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);

  useEffect(() => {
    if (extensionInstalled) {
      getAvailableAccounts();
    }
  }, [extensionInstalled]);

  const checkExtensionInstalled = async () => {
    const installed = await enablePolkadotExtension();

    setAccountListOpen(true);
    setExtensionInstalled(installed);
  };

  const getAvailableAccounts = async () => {
    const accounts = await getRegisteredAccounts();

    setAccounts(accounts);
  };

  const handleViewProfile = () => {
    if (user && !anonymous) {
      router.push(`/profile/${user.id}`);
    }
  };

  const handleSignOut = async () => {
    if (anonymous === false) {
      logout();
    } else {
      await signOut({
        callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
        redirect: true,
      });
    }
  };

  const handleSwitchAccount = () => {
    checkExtensionInstalled();
  };

  const closeAccountList = () => {
    setAccountListOpen(false);
  };

  const handleShowNotificationList = () => {
    toggleNotification();
  };

  return (
    <>
      <ProfileHeaderComponent
        user={user}
        alias={alias}
        notificationCount={total}
        onViewProfile={handleViewProfile}
        onSwitchAccount={handleSwitchAccount}
        handleSignOut={handleSignOut}
        onShowNotificationList={handleShowNotificationList}
      />

      <PolkadotAccountList
        isOpen={accountListOpen && extensionInstalled}
        accounts={accounts}
        onSelect={signInWithAccount}
        onClose={closeAccountList}
      />

      <Prompt
        title="Account Not Found"
        icon="warning"
        open={accountListOpen && !extensionInstalled}
        onCancel={closeAccountList}
        subtitle={
          <Typography>
            Kindly check if you have{' '}
            <Link
              href="https://polkadot.js.org/extension"
              target="_blank"
              style={{color: 'rgb(255, 140, 0)'}}>
              Polkadot.js
            </Link>{' '}
            installed on your browser
          </Typography>
        }>
        <Button size="small" variant="contained" color="primary" onClick={closeAccountList}>
          Close
        </Button>
      </Prompt>
    </>
  );
};
