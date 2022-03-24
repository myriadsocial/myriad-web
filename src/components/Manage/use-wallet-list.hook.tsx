import React, {useEffect, useState} from 'react';

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
  const [walletList, setWalletList] = useState<WalletOption[]>([
    {
      id: 'near',
      title: 'NEAR',
      icons: <NearNetworkIcon24 width={'40px'} height={'40px'} />,
      isConnect: false,
      walletId: 'nearId.near',
    },
    {
      id: 'polkadot',
      title: 'Polkadot',
      icons: <PolkadotNetworkIcon width={'40px'} height={'40px'} />,
      isConnect: false,
      walletId: 'polkadotId',
    },
  ]);

  useEffect(() => {
    const list = walletList.map(option => {
      wallets.filter(wallet => {
        if (wallet.type === option.id) {
          option.isConnect = true;
          option.walletId = wallet.id;
        }
      });
      return option;
    });

    setWalletList(list);
  }, [wallets]);

  return {
    walletList,
  };
};
