import {BlockchainProps} from '../../interfaces/blockchain-interface';
import {Near} from './near-api-js';
import {PolkadotJs} from './polkadot-js';

import {Network} from 'src/interfaces/network';
import {BlockchainPlatform} from 'src/interfaces/wallet';

export class BlockchainProvider {
  private readonly _provider: BlockchainProps;

  constructor(provider: BlockchainProps) {
    this._provider = provider;
  }

  static async connect(network: Network) {
    switch (network.blockchainPlatform) {
      case BlockchainPlatform.SUBSTRATE:
        const api = await PolkadotJs.connect(network);
        return new BlockchainProvider(api);

      case BlockchainPlatform.NEAR: {
        const nearWallet = await Near.connect(network);
        return new BlockchainProvider(nearWallet);
      }

      default:
        throw new Error('ProviderNotExist');
    }
  }

  get provider() {
    return this._provider;
  }

  get Near() {
    return this._provider as Near;
  }

  get PolkadotJs() {
    return this._provider as PolkadotJs;
  }
}
