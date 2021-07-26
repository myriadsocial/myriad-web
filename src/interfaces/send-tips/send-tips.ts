import {BalanceDetail} from 'src/interfaces/balance';
import {Token} from 'src/interfaces/token';
import {WalletDetail} from 'src/interfaces/wallet';

export interface InputState {
  amount: string;
}

export interface InputErrorState {
  isErrorInput: boolean;
  isTextChanged: boolean;
  isInsufficientBalance: boolean;
  errorMessage: string;
}

export type Props = {
  userAddress: string;
  success: (postId: string) => void;
  postId: string;
  balanceDetails: BalanceDetail[];
  receiverId?: string;
  availableTokens: Token[];
  walletReceiverDetail?: WalletDetail;
  isShown: boolean;
  hide: () => void;
};

export interface SendTipWithPayloadProps {
  senderAddress: string;
  toAddress: string;
  amountSent: number;
  decimals: number;
  currencyId: string;
  postId: string;
  wsAddress: string;
}

export enum ContentType {
  POST = 'postContent',
  COMMENT = 'commentContent',
}
