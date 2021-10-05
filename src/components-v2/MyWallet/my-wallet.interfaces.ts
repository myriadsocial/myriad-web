// TODO: refactor task: move this to interfaces/balance.ts when rewiring data
type CurrencyDetail = {
  id: string;
  image: string;
  decimal: number;
  rpcURL: string;
};

type BalanceDetail = CurrencyDetail & {
  freeBalance: number;
};

type MyWalletProps = {
  headerTitle: string;
};

export type {BalanceDetail, MyWalletProps};
