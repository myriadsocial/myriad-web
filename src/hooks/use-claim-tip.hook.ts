import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {useNearApi} from './use-near-api.hook';
import {usePolkadotApi} from './use-polkadot-api.hook';

import useBlockchain from 'components/common/Blockchain/use-blockchain.hook';
import {getServerId} from 'src/helpers/wallet';
import {FeeInfo} from 'src/interfaces/blockchain-interface';
import {Network, NetworkIdEnum} from 'src/interfaces/network';
import * as TransactionAPI from 'src/lib/api/transaction';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const useClaimTip = () => {
  const {user, networks, socials} = useSelector<RootState, UserState>(state => state.userState);
  const {getClaimTipNear} = useNearApi();
  const {getClaimTipMyriad} = usePolkadotApi();
  const {server, provider} = useBlockchain();

  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimingAll, setClaimingAll] = useState(false);
  const [tipsEachNetwork, setTipsEachNetwork] = useState<Network[]>(networks);
  const [feeInfo, setFeeInfo] = useState<FeeInfo>({
    formattedTrxFee: '0.00',
    trxFee: '0',
  });

  const currentWallet = user.wallets[0];

  useEffect(() => {
    if (currentWallet) getTip();
  }, [currentWallet]);

  const getTip = async () => {
    setLoading(true);

    if (!user || !server) return setLoading(false);

    const currentNetworkId = currentWallet.networkId;
    const sortedNetworkPromise = [];

    try {
      const networkCallback = async (network: Network) => {
        const serverId = getServerId(server, network.id);
        const tipBalanceInfo = {
          serverId: serverId,
          referenceType: 'user',
          referenceId: user.id,
          ftIdentifier: 'native',
        };

        if (!serverId) return network;

        switch (network.id) {
          case NetworkIdEnum.MYRIAD: {
            const result = await getClaimTipMyriad(
              server,
              user.id,
              currentWallet,
              socials,
              network,
            );

            const {tipsResults, feeInfo: fee} = result;

            if (fee) setFeeInfo(fee);

            return {
              ...network,
              tips: tipsResults,
            };
          }

          case NetworkIdEnum.NEAR: {
            const {serverId, referenceId} = tipBalanceInfo;
            const referenceIds = socials.map(social => social.peopleId);
            const result = await getClaimTipNear(
              serverId,
              referenceId,
              referenceIds,
              currentWallet,
              network,
            );

            const {tipsResults, feeInfo: fee} = result;

            if (fee) setFeeInfo(fee);

            return {
              ...network,
              tips: tipsResults,
            };
          }

          default:
            return network;
        }
      };

      for (const network of networks) {
        if (network.id === currentNetworkId) {
          sortedNetworkPromise.unshift(networkCallback(network));
        } else {
          sortedNetworkPromise.push(networkCallback(network));
        }
      }

      const networksWithTip = await Promise.all<Network[]>(sortedNetworkPromise);

      setTipsEachNetwork(networksWithTip);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const claim = async (
    networkId: string,
    ftIdentifier: string,
    callback?: ({claimSuccess: boolean, errorMessage: string}) => void,
  ) => {
    if (!user) return;
    if (!user?.wallets[0]) return;

    const selectedNetwork = networks.find(network => network.id == networkId);

    if (!selectedNetwork) return;

    let errorMessage = null;
    let claimSuccess = true;

    setClaiming(true);

    try {
      const serverId = getServerId(server, selectedNetwork.id);

      if (!serverId) throw new Error('ServerNotExists');

      const currency = selectedNetwork.currencies?.find(({native, referenceId}) => {
        if (ftIdentifier === 'native' && native) return true;
        return referenceId === ftIdentifier;
      });

      const trxInfo = {
        userId: user.id,
        walletId: currentWallet.id,
        currencyIds: [currency.id],
      };

      await provider.claimTip(serverId, user.id, [ftIdentifier], JSON.stringify(trxInfo), false);

      if (currency) TransactionAPI.updateTransaction(trxInfo);

      getTip();
    } catch (error) {
      errorMessage = error.message;
      claimSuccess = false;
    } finally {
      setClaiming(false);
      callback && callback({claimSuccess, errorMessage});
    }
  };

  const claimAll = async (
    networkId: string,
    callback?: ({claimSuccess: boolean, errorMessage: string}) => void,
  ) => {
    if (!user) return;

    let errorMessage = null;
    let claimSuccess = true;

    setClaimingAll(true);

    const walletId = currentWallet.id;
    const serverId = getServerId(server, networkId as NetworkIdEnum);
    const selectedNetwork = networks.find(network => network.id == networkId);
    const userId = user.id;
    const currencyIds = [];
    const ftIdentifiers = ['native'];

    selectedNetwork?.currencies?.forEach(currency => {
      currencyIds.push(currency.id);
      if (Boolean(currency.referenceId)) {
        ftIdentifiers.push(currency.referenceId);
      }
    });

    try {
      if (!serverId) throw new Error('ServerNotExists');

      const trxInfo = {
        userId: user.id,
        walletId: currentWallet.id,
        currencyIds,
      };

      await provider.claimTip(serverId, userId, ftIdentifiers, JSON.stringify(trxInfo), true);

      if (currencyIds.length > 0) TransactionAPI.updateTransaction({userId, walletId, currencyIds});

      getTip();
    } catch (error) {
      errorMessage = error.message;
      claimSuccess = false;
    } finally {
      setClaimingAll(false);
      callback && callback({claimSuccess, errorMessage});
    }
  };

  return {
    loading,
    claiming,
    claimingAll,
    getTip,
    claim,
    claimAll,
    feeInfo,
    tipsEachNetwork,
  };
};
