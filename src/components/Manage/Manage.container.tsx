import React from 'react';
import {useSelector} from 'react-redux';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {PolkadotAccountList} from '../PolkadotAccountList';
import {BoxComponent} from '../atoms/Box';
import {Manage} from './Manage';

import {useAuthHook} from 'src/hooks/auth.hook';
import {useNearApi} from 'src/hooks/use-near-api.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const ManageCointainer: React.FC = () => {
  const {currentWallet, wallets} = useSelector<RootState, UserState>(state => state.userState);
  const {enablePolkadotExtension} = usePolkadotExtension();
  const {getRegisteredAccounts} = useAuthHook();
  const {connectNetwork} = useAuthHook();
  const {connectToNear} = useNearApi();

  const [showAccountList, setShowAccountList] = React.useState(false);
  const [extensionInstalled, setExtensionInstalled] = React.useState(false);
  const [accounts, setAccounts] = React.useState<InjectedAccountWithMeta[]>([]);

  const closeAccountList = () => {
    setShowAccountList(false);
  };

  const checkExtensionInstalled = async () => {
    const installed = await enablePolkadotExtension();

    setShowAccountList(true);
    setExtensionInstalled(installed);

    getAvailableAccounts();
  };

  const getAvailableAccounts = async () => {
    const accounts = await getRegisteredAccounts();

    setAccounts(accounts);
  };

  const handleConnect = async (account?: InjectedAccountWithMeta) => {
    if (account) connectNetwork(account);
    else {
      const {publicAddress, signature} = await connectToNear();
      const payload = {
        nearAddress: publicAddress.split('/')[1],
        pubKey: publicAddress.split('/')[0],
        signature,
      };

      connectNetwork(undefined, payload);
    }
  };

  const onConnect = (type: string) => {
    switch (type) {
      case 'polkadot':
        checkExtensionInstalled();
        break;
      case 'near':
        handleConnect();
        break;
      default:
        break;
    }
  };

  return (
    <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
      <Manage currentWallet={currentWallet} wallets={wallets} onConnect={onConnect} />
      <PolkadotAccountList
        align="left"
        title="Select account"
        isOpen={showAccountList && extensionInstalled}
        accounts={accounts}
        onSelect={handleConnect}
        onClose={closeAccountList}
      />
    </BoxComponent>
  );
};

export default ManageCointainer;
