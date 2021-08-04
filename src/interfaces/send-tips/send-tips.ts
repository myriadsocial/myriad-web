import {Token} from 'src/interfaces/token';
import {ContentType} from 'src/interfaces/wallet';

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
  receiverId?: string;
  availableTokens: Token[];
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
