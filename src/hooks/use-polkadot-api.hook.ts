import {StorageKey} from '@polkadot/types';
import {AnyTuple, Codec} from '@polkadot/types/types';
import {BN} from '@polkadot/util';

import useBlockchain from 'components/common/Blockchain/use-blockchain.hook';
import {Network, TipResult, TipsBalanceData} from 'src/interfaces/network';
import {SocialMedia} from 'src/interfaces/social';
import {BlockchainProvider} from 'src/lib/services/blockchain-provider';

interface TipsBalanceResult {
  tipsBalances: TipsBalanceData;
  peopleIds: string[];
}

export const usePolkadotApi = () => {
  const blockchain = useBlockchain();
  const _provider = blockchain.provider;

  const getClaimTipMyriad = async (
    serverId: string,
    referenceId: string,
    accountId: string,
    socials: SocialMedia[],
    network: Network,
  ): Promise<TipsBalanceResult> => {
    let exists = true;
    let provider = _provider;

    const providerName = provider.constructor.name;
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
        accountId: providerName === 'Polkadot' ? accountId : null,
      },
    };

    if (providerName !== 'Polkadot') {
      const blockchain = await BlockchainProvider.connect(network);

      provider = blockchain.provider;
      exists = false;
    }

    const socialTipsPromise = Promise.all(
      socials.map(social => {
        peopleIds.push(social.peopleId);
        return provider.claimTipBalances(serverId, 'people', [social.peopleId]);
      }),
    );

    const [socialTips, userTips] = await Promise.all([
      socialTipsPromise,
      provider.claimTipBalances(serverId, 'user', [referenceId]),
    ]);

    for (const socialTip of socialTips) {
      if (socialTip.length === 0) continue;
      for (const [_, rawTipBalance] of socialTip as [StorageKey<AnyTuple>, Codec][]) {
        const tipsBalance = rawTipBalance.toHuman() as unknown as TipResult;
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
      const tipsBalance = rawTipBalance.toHuman() as unknown as TipResult;
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

    if (!exists) await provider.disconnect();

    return {
      tipsBalances: data,
      peopleIds,
    };
  };

  return {
    getClaimTipMyriad,
  };
};
