import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import {signOut} from 'next-auth/client';
import {useRouter} from 'next/router';

import {Button} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {ProfileHeader as ProfileHeaderComponent} from '.';
import {PolkadotAccountList} from '../PolkadotAccountList';

import {useAuthHook} from 'src/hooks/auth.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';
import {Prompt} from 'src/stories/Prompt.stories';

export const ProfileHeaderContainer: React.FC = () => {
  const {user, alias, anonymous} = useSelector<RootState, UserState>(state => state.userState);

  const router = useRouter();

  const {enablePolkadotExtension, getPolkadotAccounts} = usePolkadotExtension();
  const {logout, signInWithAccount} = useAuthHook();

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
    const accounts = await getPolkadotAccounts();

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

  if (!user) return null;

  return (
    <>
      <ProfileHeaderComponent
        user={user}
        alias={alias}
        onViewProfile={handleViewProfile}
        onSwitchAccount={handleSwitchAccount}
        handleSignOut={handleSignOut}
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
        subtitle="Kindly check if you have Polkadot.js installed on your browser">
        <Button size="small" variant="contained" color="primary" onClick={closeAccountList}>
          Close
        </Button>
      </Prompt>
    </>
  );
};
