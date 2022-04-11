import {MenuOptions} from '../atoms/DropdownMenu';

import {TransactionOrderType} from 'src/interfaces/transaction';

export const transactionSortOptions: MenuOptions<TransactionOrderType>[] = [
  {
    id: TransactionOrderType.LATEST,
    title: 'Latest',
  },
  {
    id: TransactionOrderType.HIGHEST,
    title: 'Highest',
  },
  {
    id: TransactionOrderType.LOWEST,
    title: 'Lowest',
  },
];

export const transactionStatusOptions: MenuOptions<string>[] = [
  {
    id: 'all',
    title: 'All',
  },
  {
    id: 'received',
    title: 'Received',
  },
  {
    id: 'sent',
    title: 'Sent',
  },
  {
    id: 'failed',
    title: 'Failed',
  },
];
