import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {BN} from '@polkadot/util';

import {useNearApi} from './use-near-api.hook';
import {usePolkadotApi} from './use-polkadot-api.hook';

import useBlockchain from 'components/common/Blockchain/use-blockchain.hook';
import {formatBalanceV2} from 'src/helpers/balance';
import {getServerId} from 'src/helpers/wallet';
import {Network, NetworkIdEnum} from 'src/interfaces/network';
import {updateTransaction} from 'src/lib/api/transaction';
import * as WalletAPI from 'src/lib/api/wallet';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

interface FeeInfo {
  formattedTrxFee: string;
  trxFee: string;
}

export const useClaimTip = () => {
  const {user, networks, socials} = useSelector<RootState, UserState>(state => state.userState);
  const {getClaimTipNear} = useNearApi();
  const {getClaimTipMyriad} = usePolkadotApi();
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimingAll, setClaimingAll] = useState(false);
  const [tipsEachNetwork, setTipsEachNetwork] = useState<Network[]>([]);
  const [server, setServer] = useState<WalletAPI.Server>(null);
  const [feeInfo, setFeeInfo] = useState<FeeInfo>({
    formattedTrxFee: '0.00',
    trxFee: '0',
  });

  const blockchain = useBlockchain();
  const provider = blockchain.provider;
  const currentWallet = user.wallets[0];

  useEffect(() => {
    if (server && provider) getTip();
    if (!server) {
      WalletAPI.getServer()
        .then(server => {
          setServer(server);
        })
        .catch(() => setLoading(false));
    }

    return () => {
      if (server) {
        setServer(null);
      }
    };
  }, [server, provider]);

  const getTip = async () => {
    if (!user) return setLoading(false);

    const currentNetworkId = currentWallet.networkId;
    const sortedNetworkPromise = [];

    try {
      let nativeDecimal = 0;
      let currencyIds: string[] = [];
      let referenceIds: string[] = [];

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
              server.id,
              user.id,
              currentWallet.id,
              socials,
              network,
            );

            if (!result) return network;

            const {tipsBalances, peopleIds} = result;

            network.tips = network.currencies.map(currency => {
              const {native, referenceId, decimal, symbol, image} = currency;
              const ftIdentifier = native && !referenceId ? 'native' : referenceId;
              const tipsBalance = tipsBalances[ftIdentifier] ?? {
                tipsBalanceInfo: {...tipBalanceInfo, ftIdentifier},
                accountId: currentWallet.id,
                amount: new BN(0),
              };

              const currentNetworkCurrency = ['native'];
              if (referenceId) currencyIds.push(referenceId);
              if (!tipsBalance.accountId && currentNetworkId === network.id && native) {
                referenceIds = peopleIds;
                nativeDecimal = currency.decimal;
                currencyIds = currentNetworkCurrency;
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
            const tipResults = await getClaimTipNear(serverId, referenceId, referenceIds, network);

            if (tipResults.length === 0) return network;

            network.tips = tipResults.map(e => {
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

              if (currentNetworkId === network.id && currency.native) {
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
        const fee = await provider.claimReferenceFee({
          references: {referenceType: 'people', referenceIds},
          mainReferences: {referenceType: 'user', referenceIds: [user.id]},
          currencyIds,
          server,
        });
        const finalTxFee = formatBalanceV2(fee.toString(), nativeDecimal, 4);

        setFeeInfo({
          formattedTrxFee: finalTxFee,
          trxFee: fee.toString(),
        });

        return result;
      });

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

      if (currency) updateTransaction(trxInfo);

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

      if (currencyIds.length > 0) updateTransaction({userId, walletId, currencyIds});

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
