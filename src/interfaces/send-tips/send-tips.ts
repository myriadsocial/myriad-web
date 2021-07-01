import { BalanceDetail } from 'src/interfaces/balance';

export interface InputState {
  amount: string;
}

export interface InputErrorState {
  isErrorInput: boolean;
  isTextChanged: boolean;
  isInsufficientBalance: boolean;
  errorMessage: string;
}

export interface SendTipConfirmed {
  isConfirmed: boolean;
  message: string;
}

export type Props = {
  userAddress: string;
  postId: string;
  balanceDetails: BalanceDetail[];
  receiverId?: string;
};
