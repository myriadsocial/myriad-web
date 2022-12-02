import React from 'react';

import {NearNetworkIcon24, PolkadotNetworkIcon} from 'src/components/atoms/Icons';
import {Wallet} from 'src/interfaces/user';
import {BlockchainPlatform} from 'src/interfaces/wallet';

export type WalletOption = {
  id: string;
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
    const findWalletId = (platform: BlockchainPlatform) => {
      let walletId;
      wallets.forEach(wallet => {
        if (wallet?.network?.blockchainPlatform === platform) walletId = wallet.id;
      });

      return walletId;
    };

    return [
      {
        id: 'near',
        title: 'NEAR Wallet',
        icons: <NearNetworkIcon24 width={40} height={40} />,
        isConnect: Boolean(
          wallets.find(i => i?.network?.blockchainPlatform === BlockchainPlatform.NEAR),
        ),
        walletId: findWalletId(BlockchainPlatform.NEAR) ?? 'nearId.near',
        blockchainPlatform: BlockchainPlatform.NEAR,
      },
      {
        id: 'polkadot',
        title: 'polkadot{.js}',
        icons: <PolkadotNetworkIcon width={40} height={40} />,
        isConnect: Boolean(
          wallets.find(i => i?.network?.blockchainPlatform === BlockchainPlatform.SUBSTRATE),
        ),
        walletId: findWalletId(BlockchainPlatform.SUBSTRATE) ?? 'polkadotId',
        blockchainPlatform: BlockchainPlatform.SUBSTRATE,
      },
    ];
  }, [wallets]);

  return {
    walletList,
  };
};
