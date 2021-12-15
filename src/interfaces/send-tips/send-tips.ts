import {Currency} from 'src/interfaces/currency';
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
  availableTokens: Currency[];
}

export interface SendTipProps {
  from: string;
  to: string;
  value: number;
  decimals: number;
  currencyId: string;
  referenceId: string;
  contentType: ContentType;
  wsAddress: string;
  native: boolean;
}
