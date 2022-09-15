import {StorageKey} from '@polkadot/types';
import {AnyTuple, Codec} from '@polkadot/types/types';
import {BN, BN_ZERO} from '@polkadot/util';

import {formatBalanceV2} from 'src/helpers/balance';
import {TipsResultsProps, TipsBalanceData, TipsResult} from 'src/interfaces/blockchain-interface';
import {Network} from 'src/interfaces/network';
import {SocialMedia} from 'src/interfaces/social';
import {Wallet} from 'src/interfaces/user';
import {Server} from 'src/lib/api/server';
import {PolkadotJs} from 'src/lib/services/polkadot-js';

export const usePolkadotApi = () => {
  const getClaimTipMyriad = async (
    server: Server,
    referenceId: string,
    wallet: Wallet,
    socials: SocialMedia[],
    network: Network,
  ): Promise<TipsResultsProps> => {
    const serverId = server.accountId[network.id];
    const accountId = wallet.id;
    const peopleIds: string[] = [];
    const data: TipsBalanceData = {
      native: {
        tipsBalanceInfo: {
          serverId,
          referenceType: 'user',
          referenceId,
          ftIdentifier: 'native',
        },
        amount: new BN(0),
        accountId,
      },
    };

    const provider = await PolkadotJs.connect(network);

    const socialTipsPromise = Promise.all(
      socials.map(social => {
        peopleIds.push(social.peopleId);
        return PolkadotJs.claimTipBalances(provider.provider, serverId, 'people', [
          social.peopleId,
        ]);
      }),
    );

    const [socialTips, userTips] = await Promise.all([
      socialTipsPromise,
      PolkadotJs.claimTipBalances(provider.provider, serverId, 'user', [referenceId]),
    ]);

    for (const socialTip of socialTips) {
      if (socialTip.length === 0) continue;
      for (const [_, rawTipBalance] of socialTip as [StorageKey<AnyTuple>, Codec][]) {
        const tipsBalance = rawTipBalance.toHuman() as unknown as TipsResult;
        const ftIdentifier = tipsBalance.tipsBalanceInfo.ftIdentifier;
        const amount = new BN(tipsBalance.amount.replace(/,/gi, ''));

        if (amount.isZero()) continue;
        if (data[ftIdentifier] === undefined) {
          data[ftIdentifier] = {
            tipsBalanceInfo: {
              serverId,
              referenceType: 'user',
              referenceId: referenceId,
              ftIdentifier,
            },
            amount: new BN(0),
            accountId: null,
          };
        }

        const dataAmount = data[ftIdentifier].amount;
        data[ftIdentifier].amount = dataAmount.add(amount);
        data[ftIdentifier].accountId = null;
      }
    }

    for (const [_, rawTipBalance] of userTips as [StorageKey<AnyTuple>, Codec][]) {
      const tipsBalance = rawTipBalance.toHuman() as unknown as TipsResult;
      const ftIdentifier = tipsBalance.tipsBalanceInfo.ftIdentifier;
      const amount = new BN(tipsBalance.amount.replace(/,/gi, ''));
      const accountId = tipsBalance.accountId;

      if (data[ftIdentifier] === undefined) {
        data[ftIdentifier] = {
          tipsBalanceInfo: tipsBalance.tipsBalanceInfo,
          amount: new BN(0),
          accountId: tipsBalance.accountId,
        };
      }

      const dataAmount = data[ftIdentifier].amount;
      data[ftIdentifier].amount = dataAmount.add(amount);
      if (!accountId) data[ftIdentifier].accountId = null;
    }

    let nativeDecimal = 0;
    let accountIdExist = true;

    const currencyIds = ['native'];
    const tipsResults = network.currencies.map(currency => {
      const {native, referenceId, decimal, symbol, image} = currency;
      const ftIdentifier = native && !referenceId ? 'native' : referenceId;
      const tipsBalance = data[ftIdentifier] ?? {
        tipsBalanceInfo: {serverId, referenceType: 'user', referenceId, ftIdentifier},
        accountId,
        amount: new BN(0),
      };

      if (referenceId) currencyIds.push(referenceId);
      if (wallet.networkId === network.id) {
        if (native) nativeDecimal = currency.decimal;
        if (!tipsBalance.accountId && tipsBalance.amount.gt(BN_ZERO)) accountIdExist = false;
      }

      return {
        accountId: tipsBalance.accountId,
        amount: formatBalanceV2(tipsBalance.amount.toString(), decimal, 3),
        tipsBalanceInfo: tipsBalance.tipsBalanceInfo,
        symbol: symbol ?? 'UNKNOWN',
        imageURL: image ?? '',
      };
    });

    let feeInfo = null;

    if (network.id === wallet.networkId && !accountIdExist) {
      const fee = await PolkadotJs.claimReferenceFee(provider.provider, wallet.id, {
        references: {referenceType: 'people', referenceIds: peopleIds},
        mainReferences: {referenceType: 'user', referenceIds: [referenceId]},
        currencyIds,
        server,
      });

      const finalTxFee = formatBalanceV2(fee.toString(), nativeDecimal, 4);

      feeInfo = {
        formattedTrxFee: finalTxFee,
        trxFee: fee.toString(),
      };
    }

    await provider.disconnect();

    return {
      tipsResults: tipsResults,
      feeInfo,
    };
  };

  return {
    getClaimTipMyriad,
  };
};
