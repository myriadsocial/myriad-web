import {Transaction} from '../../interfaces/transaction';

// TODO: move this to interfaces/balance.ts when rewiring data
type CurrencyDetail = {
  id: string;
  name: string;
  image: string;
  decimal: number;
  rpcURL: string;
};

type BalanceDetail = CurrencyDetail & {
  freeBalance: number;
};

type MyWalletProps = {
  headerTitle: string;
  balanceDetails: BalanceDetail[];
  historyDetails: Transaction[];
};

export type {BalanceDetail, MyWalletProps};
