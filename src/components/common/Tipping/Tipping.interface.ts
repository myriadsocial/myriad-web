import {BN} from '@polkadot/util';

import {BalanceDetail} from 'src/interfaces/balance';
import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {People} from 'src/interfaces/people';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import {WalletDetail} from 'src/interfaces/wallet';
import {WalletTypeEnum, NetworkTypeEnum} from 'src/lib/api/ext-auth';

interface UserWithWalletDetail extends User {
  walletDetail?: WalletDetail;
}

interface PeopleWithWalletDetail extends People {
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
  currentNetwork?: NetworkTypeEnum;
  loading: boolean;
}

export type SendTipProps = {
  sender: User;
  receiver: UserWithWalletDetail | PeopleWithWalletDetail;
  reference: Post | Comment | User;
  referenceType: ReferenceType;
  defaultCurrency: BalanceDetail;
  balances: BalanceDetail[];
  currentNetwork: NetworkTypeEnum;
  onSuccess: (currency: BalanceDetail, transactionHash: string, amount: BN) => Promise<void> | void;
};
