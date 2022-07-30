import {useSelector} from 'react-redux';

import useBlockchain from 'components/common/Blockchain/use-blockchain.hook';
import {Network, NetworkIdEnum} from 'src/interfaces/network';
import {SignatureProps, TipResult} from 'src/lib/services/blockchain-interface';
import {BlockchainProvider} from 'src/lib/services/blockchain-provider';
import {Near} from 'src/lib/services/near-api-js';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export interface TipBalanceInfo {
  server_id: string;
  reference_type: string;
  reference_id: string;
  ft_identifier: string;
}

export const useNearApi = () => {
  const {networks} = useSelector<RootState, UserState>(state => state.userState);

  const blockchain = useBlockchain();
  const _provider = blockchain.provider;

  const connectToNear = async (
    callbackUrl?: string,
    failedCallbackUrl?: string,
  ): Promise<SignatureProps | null> => {
    const network = networks.find(network => network.id === NetworkIdEnum.NEAR);

    if (!network) return;

    const blockchain = await BlockchainProvider.connect(network);
    const nearProvider = blockchain.Near;

    return Near.signWithWallet(
      nearProvider?.provider?.wallet,
      undefined,
      callbackUrl,
      failedCallbackUrl,
    );
  };

  const getClaimTipNear = async (
    serverId: string,
    referenceId: string,
    referenceIds: string[],
    network: Network,
  ): Promise<TipResult[]> => {
    let exists = true;
    let provider = _provider;

    const providerName = provider.constructor.name;

    if (providerName !== 'Near') {
      const blockchain = await BlockchainProvider.connect(network);

      provider = blockchain.provider;
      exists = false;
    }

    const tipResults = await provider.claimTipBalances(serverId, referenceId, referenceIds);

    if (!exists) await provider.disconnect();

    return tipResults as TipResult[];
  };

  return {
    connectToNear,
    getClaimTipNear,
  };
};
