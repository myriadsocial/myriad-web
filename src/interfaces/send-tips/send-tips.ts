import {Token} from 'src/interfaces/token';
import {WalletDetail, ContentType} from 'src/interfaces/wallet';

export interface InputState {
  amount: string;
}

export interface InputErrorState {
  isErrorInput: boolean;
  isTextChanged: boolean;
  isInsufficientBalance: boolean;
  errorMessage: string;
}

export interface Props {
  isShown: boolean;
  hide: () => void;
  userAddress: string;
  success: (postId: string) => void;
  postId: string;
  receiverId?: string;
  availableTokens: Token[];
  walletReceiverDetail: WalletDetail;
}

export interface SendTipWithPayloadProps {
  senderAddress: string;
  toAddress: string;
  amountSent: number;
  decimals: number;
  currencyId: string;
  postId: string;
  contentType: ContentType;
  wsAddress: string;
}
