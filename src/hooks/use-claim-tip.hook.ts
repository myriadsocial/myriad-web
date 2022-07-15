import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {ApiPromise} from '@polkadot/api';

import {useNearApi} from './use-near-api.hook';
import {usePolkadotApi} from './use-polkadot-api.hook';

import {remove} from 'lodash';
import {utils} from 'near-api-js';
import {formatBalance} from 'src/helpers/balance';
import {getServerId} from 'src/helpers/wallet';
import {Network, NetworkIdEnum, TipsBalanceInfo} from 'src/interfaces/network';
import {updateTransaction} from 'src/lib/api/transaction';
import * as WalletAPI from 'src/lib/api/wallet';
import {getClaimTipNear} from 'src/lib/services/near-api-js';
import {claimMyria, connectToBlockchain} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

interface FeeInfo {
  formattedTrxFee: string;
  trxFee: string;
}

interface TipsBalanceData {
  [any: string]: {
    tipsBalanceInfo: TipsBalanceInfo;
    amount: bigint;
    accountId: string;
  };
}

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
  const {claimTip, claimAllTip, defaultTxFee} = useNearApi();
  const {getClaimReferenceEstimatedFee, getClaimTipMyriad} = usePolkadotApi();
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimingAll, setClaimingAll] = useState(false);
  const [error, setError] = useState(null);
  const [tipsEachNetwork, setTipsEachNetwork] = useState<Network[]>([]);
  const [feeInfo, setFeeInfo] = useState<FeeInfo>({
    formattedTrxFee: '0.00',
    trxFee: '0',
  });

  useEffect(() => {
    const sortedNetwork = sortNetwork(networks, user.wallets[0].networkId);
    getTip(sortedNetwork);
  }, [user.wallets[0]]);

  const getTip = async (sortedNetwork: Network[]) => {
    setLoading(true);

    if (!user) return setLoading(false);

    const networkId = user.wallets[0].networkId;

    try {
      let exists = true;
      let nativeDecimal = 0;
      let api: ApiPromise = null;
      let myriadServer = null;
      let currencyIds: string[] = [];
      let referenceIds: string[] = [];

      const networkCallback = async (network: Network) => {
        const server = await WalletAPI.getServer();
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
            api = await connectToBlockchain(network.rpcURL);

            const result = await getClaimTipMyriad(
              api,
              server.id,
              user.id,
              user.wallets[0].id,
              socials,
            );

            if (!result) return network;

            const {tipsBalance, peopleIds} = result;

            if (tipsBalance.length === 0) return network;

            network.tips = tipsBalance.map(e => {
              const networkCurrencyIds: string[] = [];
              const currency = network.currencies.find(currency => {
                networkCurrencyIds.push(currency.id);
                if (currency.native && e.tipsBalanceInfo.ftIdentifier === 'native') return true;
                if (e.tipsBalanceInfo.ftIdentifier === currency.referenceId) return true;
                return false;
              });

              if (!e.accountId && networkId === network.id && currency?.native) {
                exists = false;
                nativeDecimal = currency?.decimal ?? 0;
                currencyIds = networkCurrencyIds;
                referenceIds = peopleIds;
                myriadServer = server;
              }

              return {
                accountId: e.accountId,
                amount: formatBalance(e.amount, currency.decimal, 3).toString(),
                tipsBalanceInfo: e.tipsBalanceInfo,
                symbol: currency?.symbol ?? 'UNKNOWN',
                imageURL: currency?.image ?? '',
              };
            });

            break;
          }

          case NetworkIdEnum.NEAR: {
            const {serverId, referenceId} = tipBalanceInfo;

            const referenceIds = socials.map(social => social.peopleId);
            const {data} = await getClaimTipNear(serverId, referenceId, referenceIds);
            if (data.length === 0) return network;

            network.tips = data.map(e => {
              const currency = network.currencies.find(currency => {
                const ftIdentifier = e.tips_balance.tips_balance_info.ft_identifier;
                if (currency.native && ftIdentifier === 'native') return true;
                if (ftIdentifier === currency.referenceId) return true;
                return false;
              });

              const {formatted_amount, tips_balance, symbol, unclaimed_reference_ids} = e;
              const {account_id, tips_balance_info} = tips_balance;
              const {server_id, reference_type, reference_id, ft_identifier} = tips_balance_info;
              const accountId = unclaimed_reference_ids.length === 0 ? account_id : null;

              if (!accountId && network.id === networkId && currency?.native) {
                exists = false;
                nativeDecimal = currency.decimal;
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
                const trxFee = await defaultTxFee();
                const formattedTrxFee = utils.format.formatNearAmount(trxFee);
                setFeeInfo({formattedTrxFee, trxFee});
                break;
              }

              case NetworkIdEnum.MYRIAD: {
                if (!api) break;

                const accountId = user.wallets[0].id;
                const fee = await getClaimReferenceEstimatedFee(
                  api,
                  user.id,
                  referenceIds,
                  currencyIds,
                  accountId,
                  myriadServer,
                );

                const finalTxFee = formatBalance(fee, nativeDecimal, 4);

                setFeeInfo({
                  formattedTrxFee: finalTxFee.toString(),
                  trxFee: fee.toString(),
                });

                await api.disconnect();
                break;
              }
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
      const server = await WalletAPI.getServer();
      const serverId = getServerId(server, selectedNetwork.id);

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
          const server = await WalletAPI.getServer();
          const serverId = getServerId(server, networkId);
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
    feeInfo,
  };
};
