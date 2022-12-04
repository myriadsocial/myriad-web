import {Session} from 'next-auth';

import {convertToPolkadotAddress} from './extension';

import capitalize from 'lodash/capitalize';
import {Network, NetworkIdEnum} from 'src/interfaces/network';
import {BlockchainPlatform} from 'src/interfaces/wallet';

export const formatAddress = (session?: Session) => {
  if (!session?.user?.address) return 'Unknown Address';
  if (session.user.address.length > 14) {
    const networkId = session?.user?.networkType as string;
    const validAddress = convertToPolkadotAddress(session.user.address, networkId);

    return (
      validAddress.substring(0, 4) +
      '...' +
      validAddress.substring(validAddress.length - 4, validAddress.length)
    );
  }

  return session.user.address;
};

export const formatNetworkTitle = (networkId?: NetworkIdEnum) => {
  switch (networkId) {
    case NetworkIdEnum.NEAR:
      return networkId.toUpperCase();
    default:
      return capitalize(networkId ?? 'unknown');
  }
};

export const formatWalletTitle = (network?: Network, networkId?: NetworkIdEnum) => {
  if (network) {
    switch (network?.blockchainPlatform) {
      case BlockchainPlatform.SUBSTRATE:
        return 'Polkadot{.js}';
      case BlockchainPlatform.NEAR:
        return 'NEAR Wallet';
      default:
        return 'Unknown Wallet';
    }
  }

  if (networkId) {
    switch (networkId) {
      case NetworkIdEnum.MYRIAD:
      case NetworkIdEnum.DEBIO:
      case NetworkIdEnum.KUSAMA:
      case NetworkIdEnum.POLKADOT:
        return 'Polkadot{.js}';
      case NetworkIdEnum.NEAR:
        return 'NEAR Wallet';
      default:
        return 'Unknown Wallet';
    }
  }
};
