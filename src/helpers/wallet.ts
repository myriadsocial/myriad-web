import {convertToPolkadotAddress} from './extension';

import capitalize from 'lodash/capitalize';
import {Network, NetworkIdEnum} from 'src/interfaces/network';
import {UserWallet} from 'src/interfaces/user';
import {BlockchainPlatform} from 'src/interfaces/wallet';

export const formatAddress = (currentWallet: UserWallet) => {
  if (!currentWallet) return 'Unknown Address';
  const {id, blockchainPlatform, network} = currentWallet;
  const networkId = network?.id;
  if (id && id.length > 14) {
    let validAddress = '';

    if (blockchainPlatform === BlockchainPlatform.SUBSTRATE && networkId) {
      validAddress = convertToPolkadotAddress(id, networkId);
    } else {
      validAddress = id;
    }

    return (
      validAddress.substring(0, 4) +
      '...' +
      validAddress.substring(validAddress.length - 4, validAddress.length)
    );
  }
  return id;
};

export const formatNetworkTitle = (network?: Network, networkId?: NetworkIdEnum) => {
  const id = network?.id ?? networkId;
  switch (id) {
    case NetworkIdEnum.NEAR:
      return id.toUpperCase();
    default:
      return capitalize(id ?? 'unknown');
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
