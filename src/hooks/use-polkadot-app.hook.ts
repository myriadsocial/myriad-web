import { useState } from 'react';

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import Axios from 'axios';
import { User } from 'src/interfaces/user';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const usePolkadotExtension = () => {
  const [isExtensionInstalled, setExtensionInstalled] = useState(false);
  const [isInjected, setIsInjected] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);

  const getRegisteredAccounts = async (accounts: InjectedAccountWithMeta[]) => {
    console.log(accounts);

    console.log({
      id: {
        inq: accounts.map(account => account.address)
      }
    });
    try {
      const { data: users } = await MyriadAPI.request<User[]>({
        url: '/users',
        method: 'GET',
        params: {
          filter: {
            where: {
              id: {
                inq: accounts.map(account => account.address)
              }
            }
          }
        }
      });

      setAccounts(
        accounts.filter(account => {
          const addresses = users.map(user => user.id);

          return addresses.includes(account.address);
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getPolkadotAccounts = async () => {
    const { web3Enable, web3Accounts } = await import('@polkadot/extension-dapp');

    setLoading(true);

    const extensions = await web3Enable(process.env.NEXT_PUBLIC_APP_NAME || 'myriad-dev');

    setIsInjected(true);

    if (extensions.length === 0) {
      setExtensionInstalled(false);
      // no extension installed, or the user did not accept the authorization
      // in this case we should inform the use and give a link to the extension
    } else {
      setExtensionInstalled(true);
      const prefix = process.env.NEXT_PUBLIC_POLKADOT_KEYRING_PREFIX ? Number(process.env.NEXT_PUBLIC_POLKADOT_KEYRING_PREFIX) : 214;
      const allAccounts = await web3Accounts({
        ss58Format: prefix
      });

      if (allAccounts.length) {
        await getRegisteredAccounts(allAccounts);
      }
    }

    setLoading(false);
  };

  const unsubscribeFromAccounts = async () => {
    const { web3AccountsSubscribe } = await import('@polkadot/extension-dapp');
    let unsubscribe; // this is the function of type `() => void` that should be called to unsubscribe

    //// we subscribe to any account change and log the new list.
    //// note that `web3AccountsSubscribe` returns the function to unsubscribe
    unsubscribe = await web3AccountsSubscribe(injectedAccounts => {
      injectedAccounts.map(accounts => {
        console.log('detail about the unsubscribed accounts: ', accounts);
      });
    });

    //// don't forget to unsubscribe when needed, e.g when unmounting a component
    unsubscribe && unsubscribe();
  };

  return {
    isExtensionInstalled: !isLoading && isInjected && isExtensionInstalled,
    accountFetched: isInjected && !isLoading,
    accounts,
    getPolkadotAccounts,
    unsubscribeFromAccounts
  };
};
