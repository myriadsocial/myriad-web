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
  const {user, networks, currentWallet, socials} = useSelector<RootState, UserState>(
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
      const promises = networks.map(async network => {
        const serverId = await WalletAPI.getServerId(network.id);
        const tipBalanceInfo = {
          serverId: serverId,
          referenceType: 'user',
          referenceId: user.id,
          ftIdentifier: 'native',
        };

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
                referenceId: data.tipsBalanceInfo.referenceId,
                referenceType: data.tipsBalanceInfo.referenceType,
                serverId: data.tipsBalanceInfo.serverId,
              },
              symbol: 'MYRIA',
              imageURL: network.currencies[0].image,
            };

            network.tips = [result];

            break;
          }

          case NetworkIdEnum.NEAR: {
            const {serverId, referenceId} = tipBalanceInfo;
            const referenceIds = socials.map(social => social.peopleId);
            const {data} = await getClaimTipNear(serverId, referenceId, referenceIds);
            if (data.length === 0) return network;

            network.tips = data.map(e => {
              const {formatted_amount, tips_balance, symbol, unclaimed_reference_ids} = e;
              const {account_id, tips_balance_info} = tips_balance;
              const {server_id, reference_type, reference_id, ft_identifier} = tips_balance_info;
              const currency = network.currencies.find(e => e.symbol === symbol);
              const accountId = unclaimed_reference_ids.length === 0 ? account_id : null;
              return {
                symbol,
                accountId,
                amount: Number(formatted_amount).toFixed(3),
                tipsBalanceInfo: {
                  serverId: server_id,
                  referenceType: reference_type,
                  referenceId: reference_id,
                  ftIdentifier: ft_identifier,
                },
                imageURL: currency?.image,
              };
            });

            break;
          }
        }

        return network;
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

  const claim = async (
    networkId: string,
    ftIdentifier: string,
    callback?: ({claimSuccess: boolean}) => void,
  ) => {
    if (!user) return;
    if (!currentWallet) return;

    const selectedNetwork = networks.find(network => network.id == networkId);

    if (!selectedNetwork) return;

    let claimSuccess = false;

    setClaiming(true);

    try {
      const serverId = await WalletAPI.getServerId();
      const tipBalanceInfo = {
        serverId: serverId,
        referenceType: 'user',
        referenceId: user.id,
        ftIdentifier: ftIdentifier,
      };

      switch (selectedNetwork.id) {
        case NetworkIdEnum.MYRIAD: {
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
          break;
        }

        case NetworkIdEnum.NEAR:
        default:
          throw new Error('CannotClaimTip');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setClaiming(false);
      callback && callback({claimSuccess});
    }
  };

  const claimAll = async (networkId: string, callback?: () => void) => {
    if (!user) return;
    setLoading(true);

    try {
      switch (networkId) {
        case NetworkIdEnum.MYRIAD:
          await Promise.all([claim(networkId, 'native')]);
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
    claim,
    claimAll,
  };
};
