import {useSession} from 'next-auth/react';

import {BN, BN_ZERO} from '@polkadot/util';

import {formatBalanceV2} from 'src/helpers/balance';
import {TipsResultsProps, TipsBalanceData, TipsResult} from 'src/interfaces/blockchain';
import {Network} from 'src/interfaces/network';
import {SocialMedia} from 'src/interfaces/social';
import {Server} from 'src/lib/api/server';
import {toHexPublicKeyWithAddress} from 'src/lib/crypto';
import {PolkadotJs} from 'src/lib/services/polkadot-js';

export const usePolkadotApi = () => {
  const {data: session} = useSession();

  const getClaimTipMyriad = async (
    currentUserId: string,
    server: Server,
    socials: SocialMedia[],
    network: Network,
  ): Promise<TipsResultsProps> => {
    // Initialize
    const provider = await PolkadotJs.connect(network);
    const serverId = server.accountId[network.id];
    const accountId = session?.user?.address ?? null;
    const peopleIds: string[] = [];
    const data: TipsBalanceData = {};

    // Fetch data from blockchain
    const userTipsPromise = PolkadotJs.claimTipBalances(provider.provider, serverId, 'user', [
      currentUserId,
    ]);
    const socialTipsPromise = socials.map(social => {
      peopleIds.push(social.peopleId);
      return PolkadotJs.claimTipBalances(provider.provider, serverId, 'people', [social.peopleId]);
    });

    const allSocialTipsPromise = [userTipsPromise, ...socialTipsPromise];
    const allSocialTips = await Promise.all(allSocialTipsPromise);

    let hasToClaimed = false;

    // Parsing tipping data
    for (const socialTip of allSocialTips) {
      if (!socialTip.length) continue;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const tip of socialTip) {
        if (!tip.length) continue;
        const tipsBalance = tip[1].toHuman() as unknown as TipsResult;
        const tipsBalanceReferenceType = tipsBalance.tipsBalanceInfo.referenceType;
        const tipsBalanceReferenceId = tipsBalance.tipsBalanceInfo.referenceId;
        const ftIdentifier = tipsBalance.tipsBalanceInfo.ftIdentifier;
        const amount = new BN(tipsBalance.amount.replace(/,/gi, ''));

        if (amount.isZero()) continue;
        if (data[ftIdentifier] === undefined) {
          data[ftIdentifier] = {
            tipsBalanceInfo: {
              serverId,
              referenceType: 'user',
              referenceId: currentUserId,
              ftIdentifier,
            },
            amount: new BN(0),
            accountId: null,
          };
        }
        const dataAmount = data[ftIdentifier].amount;
        data[ftIdentifier].amount = dataAmount.add(amount);
        if (data[ftIdentifier].accountId) continue;
        if (tipsBalanceReferenceType === 'user' && tipsBalanceReferenceId === currentUserId) {
          if (!tipsBalance.accountId) continue;
          if (accountId === toHexPublicKeyWithAddress(tipsBalance.accountId)) {
            data[ftIdentifier].accountId = accountId;
          }
        }

        if (tipsBalanceReferenceType === 'people' && amount.gt(BN_ZERO)) {
          hasToClaimed = true;
        }
      }
    }

    let isUserHasTip = false;
    let nativeDecimal = 0;

    const currencyIds = ['native'];
    const currencies = network.currencies.map(currency => {
      const {native, referenceId, decimal} = currency;
      const ftIdentifier = native && !referenceId ? 'native' : referenceId;
      const tipsBalance = data[ftIdentifier];

      if (native) nativeDecimal = decimal;
      if (!tipsBalance) return currency;
      if (tipsBalance.amount.lte(BN_ZERO)) return currency;
      if (referenceId) currencyIds.push(referenceId);

      isUserHasTip = true;

      currency.accountId = tipsBalance.accountId;
      currency.amount = formatBalanceV2(tipsBalance.amount.toString(), decimal, 3);

      return currency;
    });

    let feeInfo = null;

    if (network.id === session?.user?.networkType && hasToClaimed) {
      const fee = await PolkadotJs.claimReferenceFee(provider.provider, accountId, {
        references: {referenceType: 'people', referenceIds: peopleIds},
        mainReferences: {referenceType: 'user', referenceIds: [currentUserId]},
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
      currencies,
      feeInfo,
      isUserHasTip,
      hasToClaimed,
    };
  };

  return {
    getClaimTipMyriad,
  };
};
