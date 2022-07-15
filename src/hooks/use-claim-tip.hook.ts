import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {BN, BN_ZERO} from '@polkadot/util';

import {useNearApi} from './use-near-api.hook';
import {usePolkadotApi} from './use-polkadot-api.hook';

import {remove} from 'lodash';
import {formatBalance} from 'src/helpers/balance';
import {Network, NetworkIdEnum, TipResult} from 'src/interfaces/network';
import {WalletReferenceType} from 'src/interfaces/wallet';
import {updateTransaction} from 'src/lib/api/transaction';
import * as WalletAPI from 'src/lib/api/wallet';
import {getClaimTipNear} from 'src/lib/services/near-api-js';
import {claimMyria, getClaimTip} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

const sortNetwork = (networks: Network[], selectedNetwork?: string) => {
  const newDefaultNetworks = [...networks];
  const defaultNetworks = remove(newDefaultNetworks, function (n) {
    return n.id === selectedNetwork;
  });
  const resultDefaultCoins = [...defaultNetworks, ...newDefaultNetworks];

  return resultDefaultCoins;
};

export const useClaimTip = () => {
  const {user, networks, socials} = useSelector<RootState, UserState>(state => state.userState);
  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);
  const {claimTip, claimAllTip, defaultTxFee} = useNearApi();
  const {getEstimatedFeeReference} = usePolkadotApi();
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimingAll, setClaimingAll] = useState(false);
  const [error, setError] = useState(null);
  const [tipsEachNetwork, setTipsEachNetwork] = useState<Network[]>([]);
  const [trxFee, setTxFee] = useState<string>(null);
  const [txFeeForMyria, setTxFeeForMyria] = useState<string>(null);

  useEffect(() => {
    const sortedNetwork = sortNetwork(networks, user.wallets[0].networkId);
    getTip(sortedNetwork);
  }, [user.wallets[0]]);

  const getTip = async (sortedNetwork: Network[]) => {
    setLoading(true);

    if (!user) return setLoading(false);

    try {
      let exists = true;
      const networkId = user.wallets[0].networkId;
      let nativeDecimal = 0;

      const networkCallback = async (network: Network) => {
        const serverId = await WalletAPI.getServerId(network.id);
        const tipBalanceInfo = {
          serverId: serverId,
          referenceType: 'user',
          referenceId: user.id,
          ftIdentifier: 'native',
        };

        if (!serverId) return network;

        switch (network.id) {
          case NetworkIdEnum.MYRIAD: {
            const data = await getClaimTip(tipBalanceInfo, network.rpcURL);
            if (!data) return network;
            if (data.amount === '0') return network;
            const result: TipResult = {
              accountId: data.accountId,
              amount: (parseFloat(data.amount.replace(/,/g, '')) / 10 ** 18).toFixed(3).toString(),
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
              if (!accountId) {
                exists = false;
                nativeDecimal = network.currencies.find(e => e.native).decimal;
              }

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
      };

      const networksWithTip = await Promise.all(sortedNetwork.map(networkCallback)).then(
        async result => {
          if (!exists) {
            switch (networkId) {
              case NetworkIdEnum.NEAR: {
                const txFee = await defaultTxFee();
                const formatted = +txFee / 10 ** nativeDecimal;
                setTxFee(formatted.toFixed(2));
                break;
              }
              case NetworkIdEnum.MYRIAD: {
                const serverId = await WalletAPI.getServerId(user.wallets[0].networkId);
                const accountIdMyriad = await WalletAPI.getAccountIdMyria(
                  user.wallets[0].networkId,
                );

                const tipBalanceInfo = {
                  ftIdentifier: 'native',
                  referenceId: user.id as string,
                  referenceType: WalletReferenceType.PEOPLE,
                  serverId: serverId as string,
                };
                let fee: BN = BN_ZERO;

                const gasPrice = await getEstimatedFeeReference(
                  user?.wallets[0].id,
                  tipBalanceInfo,
                  balanceDetails[0],
                  accountIdMyriad,
                );

                if (gasPrice) {
                  fee = gasPrice;
                }
                setTxFeeForMyria(fee.toString());
                const amount = formatBalance(fee, balanceDetails[0].decimal, 10);
                console.log('amount', fee);
                const displayAmount = fee.gt(BN_ZERO) ? (amount > 0 ? amount : '< 0.00000001') : 0;

                setTxFee(displayAmount.toString());

                break;
              }
              default:
                setTxFee('0.00');
            }
          }

          return result;
        },
      );

      setTipsEachNetwork(networksWithTip);
    } catch (error) {
      setError(error as any);
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
      const serverId = await WalletAPI.getServerId(selectedNetwork.id);

      if (!serverId) throw new Error('ServerNotExists');

      const tipBalanceInfo = {
        serverId,
        referenceType: 'user',
        referenceId: user.id,
        ftIdentifier,
      };

      const currency = selectedNetwork.currencies?.find(({native, referenceId}) => {
        if (tipBalanceInfo.ftIdentifier === 'native' && native) return true;
        return referenceId === tipBalanceInfo.ftIdentifier;
      });

      switch (selectedNetwork.id) {
        case NetworkIdEnum.MYRIAD: {
          await claimMyria(tipBalanceInfo, selectedNetwork?.rpcURL, user.wallets[0].id);
          break;
        }

        case NetworkIdEnum.NEAR: {
          let txInfo = '';

          if (currency) {
            txInfo = JSON.stringify({
              userId: user.id,
              walletId: user.wallets[0].id,
              currencyIds: [currency.id],
            });
          }

          await claimTip(
            {
              server_id: serverId,
              reference_type: 'user',
              reference_id: user.id,
              ft_identifier: ftIdentifier,
            },
            txInfo,
          );

          break;
        }

        default:
          throw new Error('CannotClaimTip');
      }

      const sortedNetwork = sortNetwork(networks, user.wallets[0].networkId);
      const promises = [getTip(sortedNetwork)];

      if (currency) {
        promises.push(
          updateTransaction({
            userId: user.id,
            walletId: user.wallets[0].id,
            currencyIds: [currency.id],
          }),
        );
      }

      await Promise.all(promises);
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

    const currencyIds =
      networks.find(network => network.id == networkId)?.currencies?.map(currency => currency.id) ??
      [];

    try {
      switch (networkId) {
        case NetworkIdEnum.MYRIAD:
          await claim(networkId, 'native', ({claimSuccess: success, errorMessage: message}) => {
            errorMessage = message;
            claimSuccess = success;
          });
          break;

        case NetworkIdEnum.NEAR: {
          const serverId = await WalletAPI.getServerId(networkId);
          const userId = user.id;

          if (!serverId) throw new Error('ServerNotExists');

          let transactionInfo = '';

          if (currencyIds.length > 0) {
            transactionInfo = JSON.stringify({
              userId: user.id,
              walletId: user.wallets[0].id,
              currencyIds,
            });
          }

          await claimAllTip(serverId, userId, transactionInfo);
          break;
        }

        default:
          break;
      }

      if (currencyIds.length > 0 && networkId !== NetworkIdEnum.NEAR) {
        await updateTransaction({
          userId: user.id,
          walletId: user.wallets[0].id,
          currencyIds,
        });
      }
    } catch (error) {
      errorMessage = error.message;
      claimSuccess = false;
    } finally {
      setClaimingAll(false);
      callback && callback({claimSuccess, errorMessage});
    }
  };

  return {
    tipsEachNetwork,
    error,
    loading,
    claiming,
    claimingAll,
    getTip,
    claim,
    claimAll,
    trxFee,
    txFeeForMyria,
  };
};
