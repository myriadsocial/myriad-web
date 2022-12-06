import React from 'react';

import {NearNetworkIcon24, PolkadotNetworkIcon} from 'src/components/atoms/Icons';
import {Wallet} from 'src/interfaces/user';
import {BlockchainPlatform, WalletTypeEnum} from 'src/interfaces/wallet';

export type WalletOption = {
  id: WalletTypeEnum;
  title: string;
  icons: JSX.Element;
  isConnect: boolean;
  walletId: string;
  blockchainPlatform: BlockchainPlatform;
};

type WalletListHook = {
  walletList: WalletOption[];
};

export const useWalletList = (wallets: Wallet[]): WalletListHook => {
  const walletList = React.useMemo<WalletOption[]>(() => {
    const defaultWallet = [
      {
        id: WalletTypeEnum.NEAR,
        title: 'NEAR Wallet',
        icons: <NearNetworkIcon24 width={40} height={40} />,
        isConnect: false,
        walletId: null,
        blockchainPlatform: BlockchainPlatform.NEAR,
      },
      {
        id: WalletTypeEnum.POLKADOT,
        title: 'polkadot{.js}',
        icons: <PolkadotNetworkIcon width={40} height={40} />,
        isConnect: false,
        walletId: null,
        blockchainPlatform: BlockchainPlatform.SUBSTRATE,
      },
    ];

    return defaultWallet.map(e => {
      const found = wallets.find(wallet => wallet.blockchainPlatform === e.blockchainPlatform);
      return {
        ...e,
        isConnect: Boolean(found),
        walletId: found?.id ?? e.walletId,
      };
    });
  }, [wallets]);

  return {
    walletList,
  };
};
