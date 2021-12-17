import React, {useState} from 'react';
import {MemoryRouter as Router, Routes, Route} from 'react-router-dom';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {Accounts} from './render/Accounts';
import {Login as LoginComponent} from './render/Login';
import {Options} from './render/Options';
import {Profile} from './render/Profile';

import {useAuthHook} from 'src/hooks/auth.hook';
import {useProfileHook} from 'src/hooks/use-profile.hook';

export const Login: React.FC = () => {
  const {getUserByAccounts, signInWithAccount, anonymous} = useAuthHook();
  const {checkUsernameAvailable} = useProfileHook();

  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);

  const handleOnconnect = (accounts: InjectedAccountWithMeta[]) => {
    setAccounts(accounts);
  };

  const handleSelectedAccount = (account: InjectedAccountWithMeta) => {
    setSelectedAccount(account);
  };

  const checkAccountRegistered = async (callback: () => void) => {
    if (selectedAccount) {
      const registered = await getUserByAccounts([selectedAccount]);

      if (registered && registered.length > 0) {
        signInWithAccount(selectedAccount);
      } else {
        callback();
      }
    }
  };

  const handleRegister = (name: string, username: string) => {
    if (selectedAccount) {
      signInWithAccount(selectedAccount, name, username);
    }
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginComponent anonymousLogin={anonymous} />} />
          <Route path="/wallet" element={<Options onConnect={handleOnconnect} />} />
          <Route
            path="/account"
            element={
              <Accounts
                accounts={accounts}
                onSelect={handleSelectedAccount}
                onNext={checkAccountRegistered}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                account={selectedAccount}
                onSubmit={handleRegister}
                checkUsernameAvailabilty={checkUsernameAvailable}
              />
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default Login;
