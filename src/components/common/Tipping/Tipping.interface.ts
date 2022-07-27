import {BN} from '@polkadot/util';

import {BalanceDetail} from 'src/interfaces/balance';
import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {NetworkIdEnum} from 'src/interfaces/network';
import {People} from 'src/interfaces/people';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import {WalletDetail, WalletTypeEnum} from 'src/interfaces/wallet';

export interface UserWithWalletDetail extends User {
  walletDetail?: WalletDetail;
}

export interface PeopleWithWalletDetail extends People {
  walletDetail?: WalletDetail;
}

export type TippingOptions = {
  receiver: UserWithWalletDetail | PeopleWithWalletDetail;
  reference: Post | Comment | User;
  referenceType: ReferenceType;
};
export interface TippingProviderProps {
  anonymous: boolean;
  sender?: User;
  balances: BalanceDetail[];
  currentWallet?: WalletTypeEnum;
  currentNetwork?: NetworkIdEnum;
  loading: boolean;
}

export type SendTipProps = {
  sender: User;
  receiver: UserWithWalletDetail | PeopleWithWalletDetail;
  reference: Post | Comment | User;
  referenceType: ReferenceType;
  defaultCurrency: BalanceDetail;
  balances: BalanceDetail[];
  currentNetwork: NetworkIdEnum;
  onSuccess: (
    currency: BalanceDetail,
    explorerURL: string,
    transactionHash: string,
    amount: BN,
  ) => Promise<void> | void;
};
