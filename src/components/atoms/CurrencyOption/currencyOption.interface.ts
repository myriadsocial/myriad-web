import {BalanceDetail} from 'src/interfaces/balance';

export type CurrencyOptionProps = {
  balanceDetails: BalanceDetail[];
  onSelect: (selected: BalanceDetail) => void;
};
