import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import _ from 'lodash';
import {Network, NetworkIdEnum} from 'src/interfaces/network';
import {updateTransaction} from 'src/lib/api/transaction';
import * as WalletAPI from 'src/lib/api/wallet';
import {getClaimTipNear} from 'src/lib/services/near-api-js';
import {getClaimTip, TipResult, claimMyria} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const useClaimTip = () => {
  const {user, networks, currentWallet} = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState(null);
  const [tipsEachNetwork, setTipsEachNetwork] = useState<Network[]>(networks);

  useEffect(() => {
    getTip();
  }, [networks]);

  const sortNetwork = (networks: Network[], selectedNetwork?: string) => {
    const newDefaultNetworks = [...networks];
    const defaultNetworks = _.remove(newDefaultNetworks, function (n) {
      return n.id === selectedNetwork;
    });
    const resultDefaultCoins = [...defaultNetworks, ...newDefaultNetworks];

    return resultDefaultCoins;
  };

  const getTip = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const serverId = await WalletAPI.getServerId();
      const tipBalanceInfo = {
        serverId: serverId,
        referenceType: 'user',
        referenceId: user.id,
        ftIdentifier: 'native',
      };

      const promises = networks.map(async network => {
        switch (network.id) {
          case NetworkIdEnum.MYRIAD: {
            const data = await getClaimTip(tipBalanceInfo, network.rpcURL);
            if (!data) return network;
            const result: TipResult = {
              accountId: data.accountId,
              amount:
                data.amount == '0'
                  ? data.amount
                  : (parseFloat(data.amount.replace(/,/g, '')) / 10 ** 18).toFixed(3).toString(),
              tipsBalanceInfo: {
                ftIdentifier: data.tipsBalanceInfo.ftIdentifier,
                referenceId: data.tipsBalanceInfo.ftIdentifier,
                referenceType: data.tipsBalanceInfo.referenceType,
                serverId: data.tipsBalanceInfo.serverId,
              },
              symbol: 'MYRIA',
              imageURL: network.currencies[0].image,
            };

            network.tips = [result];

            return network;
          }

          case NetworkIdEnum.NEAR: {
            const {serverId, referenceType, referenceId} = tipBalanceInfo;
            const data = await getClaimTipNear(serverId, referenceType, referenceId);
            if (!data) return network;
            const tips = data.data.map(e => {
              const {formatted_amount, tips_balance, symbol} = e;
              const {account_id, tips_balance_info} = tips_balance;
              const {server_id, reference_type, reference_id, ft_identifier} = tips_balance_info;
              const currency = network.currencies.find(e => e.symbol === symbol);
              return {
                symbol,
                accountId: account_id,
                amount: Number(formatted_amount).toFixed(3),
                tipsBalanceInfo: {
                  serverId: server_id,
                  referenceType: reference_type,
                  referenceId: reference_id,
                  ftIdentifier: ft_identifier,
                },
                imageURL: currency.image,
              };
            });

            network.tips = tips;
            return network;
          }

          default:
            return network;
        }
      });

      const networksWithTip = await Promise.all(promises);
      const sortedNetwork = sortNetwork(networksWithTip, currentWallet?.networkId);

      setTipsEachNetwork(sortedNetwork);
    } catch (error) {
      console.log(error);
      setError(error as any);
    } finally {
      setLoading(false);
    }
  };

  const claimTipMyria = async (networkId: string, ftIdentifier: string, callback?: () => void) => {
    if (!user) return;
    if (!currentWallet) return;
    setClaiming(true);

    try {
      const serverId = await WalletAPI.getServerId();
      const tipBalanceInfo = {
        serverId: serverId,
        referenceType: 'user',
        referenceId: user.id,
        ftIdentifier: ftIdentifier,
      };
      if (networkId == NetworkIdEnum.MYRIAD) {
        const selectedNetwork = networks.find(network => network.id == NetworkIdEnum.MYRIAD);
        if (!selectedNetwork) return;

        await claimMyria(tipBalanceInfo, selectedNetwork?.rpcURL, currentWallet);

        const currency = selectedNetwork.currencies?.find(currency => currency.native === true);

        if (currency) {
          await updateTransaction({
            userId: currentWallet.userId,
            walletId: currentWallet.id,
            currencyId: currency.id,
          });
        }
        await getTip();
      }
      callback && callback();
    } catch (error) {
      console.log(error);
    } finally {
      setClaiming(false);
    }
  };

  const claimAll = async (networkId: string, callback?: () => void) => {
    if (!user) return;
    setLoading(true);

    try {
      switch (networkId) {
        case NetworkIdEnum.MYRIAD:
          await Promise.all([claimTipMyria(networkId, 'native')]);
          break;

        default:
          break;
      }

      callback && callback();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    tipsEachNetwork,
    error,
    loading,
    claiming,
    getTip,
    claimTipMyria,
    claimAll,
  };
};
