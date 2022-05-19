import {MenuOptions} from '../atoms/DropdownMenu';

import {TransactionOrderType} from 'src/interfaces/transaction';
import i18n from 'src/locale';

export const transactionSortOptions: MenuOptions<TransactionOrderType>[] = [
  {
    id: TransactionOrderType.LATEST,
    title: i18n.t('Wallet.History.Sort_Opt.Latest'),
  },
  {
    id: TransactionOrderType.HIGHEST,
    title: i18n.t('Wallet.History.Sort_Opt.Highest'),
  },
  {
    id: TransactionOrderType.LOWEST,
    title: i18n.t('Wallet.History.Sort_Opt.Lowest'),
  },
];

export const transactionStatusOptions: MenuOptions<string>[] = [
  {
    id: 'all',
    title: i18n.t('Wallet.History.Tsx_Opt.All'),
  },
  {
    id: 'received',
    title: i18n.t('Wallet.History.Tsx_Opt.Received'),
  },
  {
    id: 'sent',
    title: i18n.t('Wallet.History.Tsx_Opt.Sent'),
  },
];
