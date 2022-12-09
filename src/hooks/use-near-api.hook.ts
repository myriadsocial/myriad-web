import {useSelector} from 'react-redux';

import {useSession} from 'next-auth/react';

import {BN, BN_ZERO} from '@polkadot/util';

import {formatBalanceV2} from 'src/helpers/balance';
import {
  CallbackURL,
  SignatureProps,
  TipsBalanceData,
  TipsResultsProps,
} from 'src/interfaces/blockchain';
import {Network, NetworkIdEnum} from 'src/interfaces/network';
import {SocialMedia} from 'src/interfaces/social';
import {WalletTypeEnum} from 'src/interfaces/wallet';
import {Server} from 'src/lib/api/server';
import {Near} from 'src/lib/services/near-api-js';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type UserNetwork = {
  userId?: string;
  network?: Network;
};

export const useNearApi = () => {
  const {networks} = useSelector<RootState, UserState>(state => state.userState);
  const {data: session} = useSession();

  const connectToNear = async (
    callbackURL?: CallbackURL,
    userNetwork?: UserNetwork,
    walletType?: WalletTypeEnum,
    action?: string,
  ): Promise<SignatureProps | null> => {
    let network = userNetwork?.network;

    if (!network) {
      network = networks.find(network => network.id === NetworkIdEnum.NEAR);
    }

    if (!network) return;

    const successCallbackURL = callbackURL?.successCallbackURL;
    const failedCallbackURL = callbackURL?.failedCallbackURL;
    const near = await Near.connect(network, walletType);
    const wallet = near?.provider?.wallet;

    return Near.signWithWallet(
      wallet,
      {successCallbackURL, failedCallbackURL},
      {userId: userNetwork?.userId, walletType},
      action,
    );
  };

  const getClaimTipNear = async (
    currentUserId: string,
    server: Server,
    socials: SocialMedia[],
    network: Network,
    isClaimingSucceed = false,
  ): Promise<TipsResultsProps> => {
    // Initialize
    const serverId = server.accountId[network.id];
    const accountId = session?.user?.address ?? null;
    const peopleIds = socials.map(social => social.peopleId);
    const data: TipsBalanceData = {};

    const socialTip = await Near.claimTipBalances(
      network.rpcURL,
      serverId,
      currentUserId,
      peopleIds,
    );

    let hasToClaimed = false;

    for (const tip of socialTip) {
      const tipsBalance = tip.tips_balance;
      const tipsBalanceReferenceType = tipsBalance.tips_balance_info.reference_type;
      const tipsBalanceReferenceId = tipsBalance.tips_balance_info.reference_id;
      const ftIdentifier = tipsBalance.tips_balance_info.ft_identifier;
      const amount = new BN(tipsBalance.amount);

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
        if (!tipsBalance.account_id) continue;
        if (accountId === tipsBalance.account_id) {
          data[ftIdentifier].accountId = accountId;
        }
      }

      if (tipsBalanceReferenceType === 'people' && amount.gt(BN_ZERO)) {
        hasToClaimed = true;
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

    if (isClaimingSucceed) {
      hasToClaimed = false;
      isUserHasTip = true;
    }

    if (network.id === session?.user?.networkType && hasToClaimed) {
      const fee = await Near.claimReferenceFee(network.rpcURL);
      const finalTxFee = formatBalanceV2(fee.toString(), nativeDecimal, 4);

      feeInfo = {
        formattedTrxFee: finalTxFee,
        trxFee: fee.toString(),
      };
    }

    return {
      currencies,
      feeInfo,
      isUserHasTip,
      hasToClaimed,
    };
  };

  return {
    connectToNear,
    getClaimTipNear,
  };
};
