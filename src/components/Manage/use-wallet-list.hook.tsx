import React from 'react';

import {NearNetworkIcon24, PolkadotNetworkIcon} from 'src/components/atoms/Icons';
import {UserWallet} from 'src/interfaces/user';

export type WalletOption = {
  id: string;
  title: string;
  icons: JSX.Element;
  isConnect: boolean;
  walletId: string;
};

type WalletListHook = {
  walletList: WalletOption[];
};

export const useWalletList = (wallets: UserWallet[]): WalletListHook => {
  const walletList = React.useMemo<WalletOption[]>(() => {
    const findWalletId = (optionId: string) => {
      let walletId;
      wallets.forEach(wallet => {
        if (wallet.type === optionId) walletId = wallet.id;
      });

      return walletId;
    };

    return [
      {
        id: 'near',
        title: 'NEAR',
        icons: <NearNetworkIcon24 width={'40px'} height={'40px'} />,
        isConnect: Boolean(wallets.find(i => i.type === 'near')),
        walletId: findWalletId('near') ?? 'nearId.near',
      },
      {
        id: 'polkadot',
        title: 'Polkadot',
        icons: <PolkadotNetworkIcon width={'40px'} height={'40px'} />,
        isConnect: Boolean(wallets.find(i => i.type === 'polkadot')),
        walletId: findWalletId('polkadot') ?? 'polkadotId',
      },
    ];
  }, [wallets]);

  return {
    walletList,
  };
};
