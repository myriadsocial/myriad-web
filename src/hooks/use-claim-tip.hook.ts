import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {ApiPromise} from '@polkadot/api';
import {BN} from '@polkadot/util';

import {useNearApi} from './use-near-api.hook';
import {usePolkadotApi} from './use-polkadot-api.hook';

import {utils} from 'near-api-js';
import {formatBalanceV2} from 'src/helpers/balance';
import {getServerId} from 'src/helpers/wallet';
import {Network, NetworkIdEnum} from 'src/interfaces/network';
import {updateTransaction} from 'src/lib/api/transaction';
import * as WalletAPI from 'src/lib/api/wallet';
import {getClaimTipNear} from 'src/lib/services/near-api-js';
import {claimTip as claimTipMyriadNetwork, connectToBlockchain} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

interface FeeInfo {
  formattedTrxFee: string;
  trxFee: string;
}

export const useClaimTip = () => {
  const {user, networks, socials} = useSelector<RootState, UserState>(state => state.userState);
  const {claimTip: claimTipNearNetwork, claimAllTip, defaultTxFee} = useNearApi();
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

  const currentWallet = user.wallets[0];

  useEffect(() => {
    if (currentWallet) {
      getTip();
    }
  }, [currentWallet]);

  const getTip = async () => {
    setLoading(true);

    if (!user) return setLoading(false);

    const currentNetworkId = currentWallet.networkId;
    const sortedNetworkPromise = [];

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
              currentWallet.id,
              socials,
            );

            if (!result) return network;

            const {tipsBalances, peopleIds} = result;
            const networkCurrencyIds: string[] = ['native'];

            network.tips = network.currencies.map(currency => {
              const {native, referenceId, decimal, symbol, image} = currency;
              const ftIdentifier = native && !referenceId ? 'native' : referenceId;
              const tipsBalance = tipsBalances[ftIdentifier] ?? {
                tipsBalanceInfo: {...tipBalanceInfo, ftIdentifier},
                accountId: null,
                amount: new BN(0),
              };

              if (referenceId) networkCurrencyIds.push(referenceId);
              if (!tipsBalance.accountId && currentNetworkId === network.id && native) {
                exists = false;
                nativeDecimal = decimal ?? 0;
                referenceIds = peopleIds;
                myriadServer = server;
                currencyIds = networkCurrencyIds;
              }

              return {
                accountId: tipsBalance.accountId,
                amount: formatBalanceV2(tipsBalance.amount.toString(), decimal, 3),
                tipsBalanceInfo: tipsBalance.tipsBalanceInfo,
                symbol: symbol ?? 'UNKNOWN',
                imageURL: image ?? '',
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

              if (!accountId && network.id === currentNetworkId && currency?.native) {
                exists = false;
                nativeDecimal = currency.decimal;
              }

              return {
                symbol,
                accountId,
                amount: parseFloat(formatted_amount).toFixed(3),
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

      for (const network of networks) {
        if (network.id === currentNetworkId) {
          sortedNetworkPromise.unshift(networkCallback(network));
        } else {
          sortedNetworkPromise.push(networkCallback(network));
        }
      }

      const networksWithTip = await Promise.all(sortedNetworkPromise).then(async result => {
        if (!exists) {
          switch (currentNetworkId) {
            case NetworkIdEnum.NEAR: {
              const trxFee = await defaultTxFee();
              const formattedTrxFee = utils.format.formatNearAmount(trxFee);
              setFeeInfo({formattedTrxFee, trxFee});
              break;
            }

            case NetworkIdEnum.MYRIAD: {
              if (!api) break;

              const accountId = currentWallet.id;
              const fee = await getClaimReferenceEstimatedFee(
                api,
                user.id,
                referenceIds,
                currencyIds,
                accountId,
                myriadServer,
              );

              const finalTxFee = formatBalanceV2(fee.toString(), nativeDecimal, 4);

              setFeeInfo({
                formattedTrxFee: finalTxFee,
                trxFee: fee.toString(),
              });

              await api.disconnect();
              break;
            }
          }
        }

        return result;
      });

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

      const currency = selectedNetwork.currencies?.find(({native, referenceId}) => {
        if (ftIdentifier === 'native' && native) return true;
        return referenceId === ftIdentifier;
      });

      switch (selectedNetwork.id) {
        case NetworkIdEnum.MYRIAD: {
          await claimTipMyriadNetwork(
            currentWallet.id,
            selectedNetwork?.rpcURL,
            serverId,
            user.id,
            [ftIdentifier],
          );

          getTip();

          if (currency) {
            updateTransaction({
              userId: user.id,
              walletId: currentWallet.id,
              currencyIds: [currency.id],
            });
          }

          break;
        }

        case NetworkIdEnum.NEAR: {
          const txInfo = currency
            ? JSON.stringify({
                userId: user.id,
                walletId: currentWallet.id,
                currencyIds: [currency.id],
              })
            : '';

          await claimTipNearNetwork(
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
    const server = await WalletAPI.getServer();
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
      switch (networkId) {
        case NetworkIdEnum.MYRIAD:
          await claimTipMyriadNetwork(
            walletId,
            selectedNetwork?.rpcURL ?? '',
            serverId,
            userId,
            ftIdentifiers,
          );

          getTip();

          if (currencyIds.length > 0) {
            updateTransaction({userId, walletId, currencyIds});
          }

          break;

        case NetworkIdEnum.NEAR: {
          if (!serverId) throw new Error('ServerNotExists');

          const txInfo =
            currencyIds.length > 0
              ? JSON.stringify({
                  userId: user.id,
                  walletId: currentWallet.id,
                  currencyIds,
                })
              : '';

          await claimAllTip(serverId, userId, txInfo);
          break;
        }

        default:
          break;
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
